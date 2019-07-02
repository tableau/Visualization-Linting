What I *think* I see (and why I could be *wrong*):

There's sort of a mix here between data-drvien issues and vis-driven issues and then fundamental "root causes of wrongness" that I need to untangle:

- "A is (significantly) greater/less than than B"
  - Outlier values in A or B combined with the wrong aggregation type.
  - A mismatch in row cardinality.
  - Missing/repeated data.
  - Drill-down bias: there is some variable C that is more explanatory of the difference between A and B.
  - Simpson's paradox
  - Truncated axes
  - Spurious difference (due to p-hacking, say. or just un-communicated sampling variability)
- "A is (significantly) correlated with/independent of B"
  - Truncated/expanded axes (see C&McG "Variables on Scatterplots Look More Highly Correlated When the Scales are Increased")
  - Missing data (perhaps I'm only focused on the narrow time window where this is true, and ignoring the larger window where it's not)
  - Spurious correlation (again, due to p-hacking or variability)
- "*x* is an outlier/inlier in A"
  - Overplotting
  - Truncated/expanded axes
  - New statistical process as a result of some hidden variable B
- "A seems to follow a particular distribution *d*"
  - Over/undersmoothed KDE
  - Over/underbinned histogram
  - Overplotting
- "The cardinality of A is approximately *x*"
  - Overplotting
  - Over-aggregating
  - Failing to surface missing values


Metaphors for how you *surface* these issues:
- Linting
- Spell checking
- Grammar checking
- Asserts
- Unit tests
- Try/catch blocks + exception throwing/handling
- Intrusion detection systems
- Virus scanners
- GANs
- Continuous integration
- Fitness scores
- Newspaper fact-checking / "awarding pinocchios"

Propositions of the form "The histogram of these data is robust to missing values":
- There is some statement of fact or statement of probability about the data (let's call it an *insight*) that is true or false *I* or *P(I)>=c*.
- There are some counterfactuals *!I* or *P(I)<c*.
- There's a visualization *V* that takes in some design parameters/settings *ω*. A visualization is a function that returns an image based on the data *d* and these settings *ω*, *V(d,ω)*.
- The insight may or may not be detectable in the visualization. Let's call this some boolean function *D(V(d,ω),I)* (the word "detectable" is doing a lot of work in this sentence).
- There is some permutation, dirtying, or other sort of fuzz testing we can perform, *α(d)*, that generates a new plausible data set (the word "plausible" is likewise doing a lot of work in this sentence).
- We then explore the space of functions and settings to try to unify *α(d)* and *ω* with our boolean function *D*. Bad things that could happen:
  - ∃ω | D(V(d,ω,I)) & !I
  - ∃ω | D(V(d,ω,!I)) & I
  - ∃α | D(V(α(d),ω,I)) & !I
  - ∃α | D(V(α(d),ω,!I)) & I
  - ∃ω ∃α | D(V(α(d),ω,I)) & !I
  - ∃ω ∃α | D(V(α(d),ω,!I)) & I

  In other words, we can fail to detect a real pattern, or detect a spurious pattern, based on either a quirk of the visualization design, a quirk of the data, or both. Each *α(d)* and *ω* is a counterfactual about how the chart plausibly *could* have been designed, or how the data *could* have been structured (I could have changed the scales of my bar chart, for instance, or I could have removed duplicated rows)

  A successful/robust visualization is then one where across the space of plausible *ω* and *α*, the truth value of *D(V(d,ω),I) & I* is preserved. So violations are then the inverse. In other words, we're performing [https://en.wikipedia.org/wiki/Unification_(computer_science)#Application:_unification_in_logic_programming](unification) over all of our *ω* and *α*, and looking for *D(V(d,ω),I) & ~I | D(V(d,ω),~I) & I* .
