# interactive-tell-me-another

Reveal a collection of tiny stories (denoted by Level 1 headings) one at a time by pressing a "Tell me another" button.

Originally implemented for the publication of a [collection of memories](https://www.abc.net.au/news/2017-05-12/let-me-tell-you-a-story-about-mark-colvin/8517888) of Mark Colvin from other ABC-ers after he passed away in 2017.

## Usage

1. Add the `[tell-me-another]` JavaScript document to an Odyssey's associated JS.
2. Author your stories in the body copy, starting each with a Level 1 heading (rendered as an `h2` element).
3. Place an `#endtellmeanother` marker after the last story (either before a credits section, or the very end of the body copy)

### Options

You can change the text on the prompt (from the default "Tell me another…") by adding `.`-delimeted words to the end of the marker. e.g.:

```
#endtellmeanother:Read.the.next.story
```

…will result in a button with the prompt "Read the next story" (each subsequent `.` will be replaced by a space). Due to the limitations of markers, the only punctuation that can be accommodated is `:` and `-`.
