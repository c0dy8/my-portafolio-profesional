import { createContext, useContext } from "react"

// False while the intro loader still covers the page. Defaults to true so components
// rendered without the loader (tests, isolated renders) play their entrance right away.
export const IntroContext = createContext(true)

export const useIntroRevealed = () => useContext(IntroContext)
