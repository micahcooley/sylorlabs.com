import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Roadmap from "@/components/Roadmap";
import Collaborators from "@/components/Collaborators";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Roadmap />
      <Collaborators />
      <Newsletter />
      <Footer />
    </main>
  );
}
