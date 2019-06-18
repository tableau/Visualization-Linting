import * as vegaImport from 'vega';
import {
  EncodeEntryName,
  Loader,
  LoaderOptions,
  Renderers,
  Spec as VgSpec,
  TooltipHandler,
  View
} from 'vega';
import * as vlImport from 'vega-lite';
import { Config as VlConfig, TopLevelSpec as VlSpec } from 'vega-lite';
import schemaParser from 'vega-schema-url-parser';


/**
 * Embed a Vega visualization component in a web page. This function returns a promise.
 *
 * @param el        DOM element in which to place component (DOM node or CSS selector).
 * @param spec      String : A URL string from which to load the Vega specification.
 *                  Object : The Vega/Vega-Lite specification as a parsed JSON object.
 * @param opt       A JavaScript object containing options for embedding.
 */
export default async function embed(el, spec, opt) {
  const loader = vega.loader(opt.loader);

  // Load the visualization specification.
  if (vega.isString(spec)) {
    const data = await loader.load(spec);
    // hmmm
    return embed(el, JSON.parse(data), opt);
  }

  const renderer = opt.renderer || 'canvas';
  const logLevel = opt.logLevel || vega.Warn;
  const downloadFileName = opt.downloadFileName || 'visualization';

  // Load Vega theme/configuration.
  let config = opt.config || {};
  if (vega.isString(config)) {
    const data = await loader.load(config);
    return embed(el, spec, { ...opt, config: JSON.parse(data) });
  }

  if (opt.defaultStyle !== false) {
    // Add a default stylesheet to the head of the document.
    const ID = 'vega-embed-style';
    if (!document.getElementById(ID)) {
      const style = document.createElement('style');
      style.id = ID;
      style.innerText =
        opt.defaultStyle === undefined || opt.defaultStyle === true ? (embedStyle || '').toString() : opt.defaultStyle;

      document.head.appendChild(style);
    }
  }

  if (opt.theme) {
    config = mergeDeep<Config>({}, themes[opt.theme], config);
  }

  const mode = guessMode(spec, opt.mode);

  let vgSpec: VgSpec = PREPROCESSOR[mode](spec, config);

  if (mode === 'vega-lite') {
    if (vgSpec.$schema) {
      const parsed = schemaParser(vgSpec.$schema);

      if (!satisfies(VERSION.vega, `^${parsed.version.slice(1)}`)) {
        console.warn(`The compiled spec uses Vega ${parsed.version}, but current version is ${VERSION.vega}.`);
      }
    }
  }

  // ensure container div has class 'vega-embed'
  const div = d3
    .select(el as any) // d3.select supports elements and strings
    .classed('vega-embed', true)
    .html(''); // clear container

  if (patch) {
    if (patch instanceof Function) {
      vgSpec = patch(vgSpec);
    } else if (vega.isString(patch)) {
      const patchString = await loader.load(patch);
      vgSpec = mergeDeep(vgSpec, JSON.parse(patchString));
    } else {
      vgSpec = mergeDeep(vgSpec, patch);
    }
  }

  // Do not apply the config to Vega when we have already applied it to Vega-Lite.
  // This call may throw an Error if parsing fails.
  const runtime = vega.parse(vgSpec, mode === 'vega-lite' ? {} : config);

  const view = new vega.View(runtime, {
    loader,
    logLevel,
    renderer
  });

  if (opt.tooltip !== false) {
    let handler: TooltipHandler;
    if (isTooltipHandler(opt.tooltip)) {
      handler = opt.tooltip;
    } else {
      // user provided boolean true or tooltip options
      handler = new Handler(opt.tooltip === true ? {} : opt.tooltip).call;
    }

    view.tooltip(handler);
  }

  let { hover } = opt;

  // Enable hover for Vega by default.
  if (hover === undefined) {
    hover = mode !== 'vega-lite';
  }

  if (hover) {
    const { hoverSet, updateSet } = (typeof hover === 'boolean' ? {} : hover) as Hover;

    view.hover(hoverSet, updateSet);
  }

  if (opt) {
    if (opt.width) {
      view.width(opt.width);
    }
    if (opt.height) {
      view.height(opt.height);
    }
    if (opt.padding) {
      view.padding(opt.padding);
    }
  }

  await view.initialize(el).runAsync();

  if (actions !== false) {
    let wrapper = div;

    if (opt.defaultStyle !== false) {
      const details = div.append('details').attr('title', i18n.CLICK_TO_VIEW_ACTIONS);
      wrapper = details;
      const summary = details.insert('summary');

      summary.html(SVG_CIRCLES);

      const dn = details.node() as HTMLDetailsElement;
      document.addEventListener('click', evt => {
        if (!dn.contains(evt.target as any)) {
          dn.removeAttribute('open');
        }
      });
    }

    const ctrl = wrapper.insert('div').attr('class', 'vega-actions');

    // add 'Export' action
    if (actions === true || actions.export !== false) {
      for (const ext of ['svg', 'png']) {
        if (actions === true || actions.export === true || actions.export![ext]) {
          const i18nExportAction = i18n[`${ext.toUpperCase()}_ACTION`];
          ctrl
            .append<HTMLLinkElement>('a')
            .text(i18nExportAction)
            .attr('href', '#')
            .attr('target', '_blank')
            .attr('download', `${downloadFileName}.${ext}`)
            // eslint-disable-next-line func-names
            .on('mousedown', function(this) {
              view
                .toImageURL(ext, opt.scaleFactor)
                .then(url => {
                  this.href = url;
                })
                .catch(error => {
                  throw error;
                });
              d3.event.preventDefault();
            });
        }
      }
    }

  }

  return { view, spec, vgSpec };
}
