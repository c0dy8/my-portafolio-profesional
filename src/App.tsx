import { LanguageProvider } from "@/context/LanguageContext"
import { IntroLoader } from "@/components/Loader"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Skills } from "@/components/Skills"
import { Projects } from "@/components/Projects"
import { Experience } from "@/components/Experience"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"
import { ChatBot } from "@/components/ChatBot"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

function App() {
  return (
    <LanguageProvider>
      <IntroLoader>
        <Navbar />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <Footer />
        <ChatBot />
        <LanguageSwitcher />
      </IntroLoader>
    </LanguageProvider>
  )
}

export default App
