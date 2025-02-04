import Footer from "@/components/footer";
import { TechHeader } from "@/components/header";
import { MainMediaLibrary } from "@/modules/media-library/components/main-media-library";

export default function Home() {

  return (
    <div className="flex flex-col items-center justify-center pt-4 md:pt-14  min-h-screen">
      <TechHeader />

      <main className="flex flex-column flex-1 items-center justify-center align-center pt-10 pb-10 bg-white dark:bg-background ">

        <MainMediaLibrary />

      </main>
      <Footer />
    </div>
  );
}
