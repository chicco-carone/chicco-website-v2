import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { SiArchlinux } from "react-icons/si";

export function GamingSection() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Gaming</h2>
        </div>

        {/* Content Layout: Text */}
        <Dialog>
          <div className="space-y-6 max-w-4xl">
            <p className="text-muted-foreground text-lg leading-relaxed">
              Since I was little I&apos;ve always enjoyed playing video games.
              My favourite genres currenltly include rhythm games, single-player
              story driver games, and recently vr games.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Since the beginning i&apos;ve a PC gamer and I&apos;ve built my
              own PC which you can check out{" "}
              <DialogTrigger asChild>
                <button className="underline hover:text-primary">here</button>
              </DialogTrigger>z
              that I upgraded from time to time.
              Oh and btw, my PC runs Arch Linux{" "}
              <SiArchlinux className="inline-block mb-1" /> as my main OS.
               When I&apos;m on the go I keep
              enjoying my library on my steam deck.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Recently I bought my first VR headset, the Meta Quest 3s, and
              I&apos;ve been loving the new experiences that VR gaming offers.
              I&apos;m currenltly exploring Half Life: Alyx and Beat Saber and
              I&apos;m really enjoying it. Now I&apos;m waiting for the new{" "}
              <a href="https://store.steampowered.com/sale/steamframe">Steam Frame</a>
              since I only play PCVR games.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Currently, the game where I&apos;m spending most of my time is osu
              where i enjoy the competitive aspect and the community around it.
              If you&apos;re interested in checking out my profile, you can find
              it{" "}
              <a
                href="https://osu.ppy.sh/users/26161155"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-primary"
              >
                here
              </a>
              .
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              When I&apos;m not playing, I like to follow gaming news,
              participate in gaming communities, and sometimes even create
              custom content or mods for games I love.
            </p>
          </div>
          <DialogContent className="max-w-md">
            <Image
              src="/IMG_0453.jpg"
              alt="My PC build"
              className="w-full h-auto"
              width={500}
              height={300}
            />
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
