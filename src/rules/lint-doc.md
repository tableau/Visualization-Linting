# Lint Rule Format



Written up here in pseudo-typescript

```ts
// 'algebraic-spec' lint rule format
// supports modification to the spec as part of the metamorphic analysis
{
  name: <STRING>,
  type: 'algebraic-spec',
  evaluator: <FUNCTION> (
    oldRendering: PngDataString,
    newRendering: PngDataString,
    spec: VegaLiteJson,
    perturbedSpec: VegaLiteJson,
    oldView: VegaView,
    newView: VegaView
  ) => Boolean
  operation: <FUNCTION> (spec: VegaLite Json) => spec: VegaLite Json
  filter: <FUNCTION> (spec: VegaLite Json, data: JSON, view: VegaView) => Boolean
  // defaults to () => true
  explain: <STRING>
}

// 'algebraic-data' lint rule format
// supports modification of the data as part of the metamorphic analysis
{

  type: 'algebraic-data',
  name: <STRING>,
  operation: <FUNCTION> (container: JSON (data), spec: VegaLiteJson) => modified data, Json
  evaluator: <FUNCTION> (oldRendering: PngDataString, newRendering: PngDataString, spec: VegaLiteJson) => Boolean,
  filter: <FUNCTION> (spec: VegaLite Json, data: JSON, view: VegaView) => Boolean
  // defaults to () => true
  explain: <STRING>
}

// stylistic lint rule format
// supports rule applications that don't involve comparisons across visualizations
{
  type: 'stylistic',
  name: <STRING>,
  evaluator: <FUNCTION> (view: VegaView, spec : VegaLiteJson, render: PngDataString) => Boolean,
  filter: <FUNCTION> (spec: VegaLite Json, data: JSON, view: VegaView) => Boolean
  // defaults to () => true
  explain: <STRING>
}
```
