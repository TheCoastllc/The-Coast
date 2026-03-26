export type Answer = {
  letter: string
  text: string
  points: number
}

export type Question = {
  text: string
  answers: Answer[]
}

export const questions: Question[] = [
  {
    text: "If a new customer landed on your homepage right now with no context, what would they experience?",
    answers: [
      { letter: "A", text: "They'd immediately understand what we do, who we're for, and why we're different", points: 3 },
      { letter: "B", text: "They'd probably get the general idea but might not be sure exactly who we serve", points: 2 },
      { letter: "C", text: "They might be confused or need to scroll before it makes sense", points: 1 },
      { letter: "D", text: "I honestly haven't thought about it from a new customer's perspective", points: 0 },
    ],
  },
  {
    text: "How would you describe your brand's visual consistency across your website, social media, and any physical materials?",
    answers: [
      { letter: "A", text: "Completely consistent \u2014 same colours, fonts, logo usage, and style everywhere", points: 3 },
      { letter: "B", text: "Mostly consistent but there are differences I've been meaning to fix", points: 2 },
      { letter: "C", text: "It varies quite a bit depending on who created the content", points: 1 },
      { letter: "D", text: "I don't have defined brand guidelines \u2014 we figure it out as we go", points: 0 },
    ],
  },
  {
    text: "When someone reads your Instagram caption, then your website copy, then an email from you \u2014 do they sound like the same brand?",
    answers: [
      { letter: "A", text: "Yes \u2014 we have a clear voice and it comes through consistently", points: 3 },
      { letter: "B", text: "Mostly, but the tone shifts depending on context or who wrote it", points: 2 },
      { letter: "C", text: "Probably not \u2014 no real standard", points: 1 },
      { letter: "D", text: "I haven't thought about it", points: 0 },
    ],
  },
  {
    text: "Can you say in one sentence what your brand does, who it's for, and why it's better?",
    answers: [
      { letter: "A", text: "Yes, and I use it consistently across all my marketing", points: 3 },
      { letter: "B", text: "I have a rough version but it changes depending on the conversation", points: 2 },
      { letter: "C", text: "I struggle to articulate it clearly", points: 1 },
      { letter: "D", text: "No, I don't have one", points: 0 },
    ],
  },
  {
    text: "How intentionally does your brand display credibility and social proof?",
    answers: [
      { letter: "A", text: "Reviews, testimonials, and UGC are prominent and consistent across all touchpoints", points: 3 },
      { letter: "B", text: "We have some but they're not as prominent as they should be", points: 2 },
      { letter: "C", text: "They just sit on the product page \u2014 not really integrated", points: 1 },
      { letter: "D", text: "We don't have much or haven't thought about how to use it", points: 0 },
    ],
  },
  {
    text: "When you look at your three main competitors, how does your brand compare?",
    answers: [
      { letter: "A", text: "Distinctly different \u2014 a customer could tell us apart immediately", points: 3 },
      { letter: "B", text: "Similar but with a slightly stronger presentation", points: 2 },
      { letter: "C", text: "We look pretty similar to most competitors", points: 1 },
      { letter: "D", text: "Some competitors look more professional than us", points: 0 },
    ],
  },
  {
    text: "If your logo was removed from your social posts, would customers still recognise them as yours?",
    answers: [
      { letter: "A", text: "Absolutely \u2014 distinctive style and voice", points: 3 },
      { letter: "B", text: "Probably \u2014 some consistent elements but not consistently enough", points: 2 },
      { letter: "C", text: "Possibly not \u2014 similar to a lot of other brands", points: 1 },
      { letter: "D", text: "Definitely not", points: 0 },
    ],
  },
  {
    text: "How consistent do your ads look and feel with your organic brand presence?",
    answers: [
      { letter: "A", text: "Completely consistent \u2014 ads are a natural extension of the brand", points: 3 },
      { letter: "B", text: "Mostly, though ads sometimes feel slightly off-brand", points: 2 },
      { letter: "C", text: "Ads often look different from organic content", points: 1 },
      { letter: "D", text: "I haven't connected the two \u2014 ads are just about the offer", points: 0 },
    ],
  },
  {
    text: "How intentionally did you build your brand identity?",
    answers: [
      { letter: "A", text: "Worked with a professional to define visual identity, voice, and strategy", points: 3 },
      { letter: "B", text: "Some professional input but pieced a lot together ourselves", points: 2 },
      { letter: "C", text: "Mostly DIY", points: 1 },
      { letter: "D", text: "Haven't really invested in brand", points: 0 },
    ],
  },
  {
    text: "If a major publication featured your brand tomorrow, how would you feel?",
    answers: [
      { letter: "A", text: "Confident \u2014 the brand is ready", points: 3 },
      { letter: "B", text: "Mostly ready but I'd want to fix a few things", points: 2 },
      { letter: "C", text: "Nervous \u2014 significant things I'd want to change", points: 1 },
      { letter: "D", text: "Not ready at all", points: 0 },
    ],
  },
]
