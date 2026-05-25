import { LanguageProvider } from "@/context/LanguageContext"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Skills } from "@/components/Skills"
import { Projects } from "@/components/Projects"
import { Experience } from "@/components/Experience"
import { Contact } from "@/components/Contact"
import { ChatBot } from "@/components/ChatBot"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <ChatBot />
      <LanguageSwitcher />
    </LanguageProvider>
  )
}

export default App
