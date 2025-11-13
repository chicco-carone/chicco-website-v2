"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

// Image configuration - add more images here as needed
const imageConfigs = [
  {
    id: 1,
    src: "/IMG_0453.jpg",
    alt: "Photography Image 1"
  }
];
;
interface ImageMetadata {
  camera: string;
  lens: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  focalLength: string;
  dateTaken: string;
  location: string;
  dimensions: string;
}

interface ImageData {
  id: number;
  src: string;
  alt: string;
  metadata: ImageMetadata | null;
  loading: boolean;
}

export function PhotographySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);

  // Load metadata for images
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages = await Promise.all(
        imageConfigs.map(async (config) => {
          try {
            const response = await fetch(`/api/image-metadata?path=${config.src.replace('/', '')}`);
            const metadata = await response.json();
            return {
              ...config,
              metadata,
              loading: false
            };
          } catch (error) {
            console.error('Failed to load metadata for', config.src, error);
            return {
              ...config,
              metadata: null,
              loading: false
            };
          }
        })
      );
      setImages(loadedImages);
    };

    loadImages();
  }, []);

  const currentImage = images[currentIndex];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Loading state
  if (images.length === 0) {
    return (
      <section className="w-full py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Photography</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </motion.div>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Photography</h2>
        </motion.div>

        {/* Content Layout: Text Left, Images Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </motion.div>

          {/* Image Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <Card className="relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
              <div className="relative aspect-[4/3] w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 300 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -300 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={currentImage?.src || ''}
                      alt={currentImage?.alt || ''}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors duration-300">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-100 transition-opacity duration-300">
                    {/* Info Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-black/50 hover:bg-black/70 text-white border-0"
                          disabled={!currentImage?.metadata}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogTitle className="sr-only">Image Metadata</DialogTitle>
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Image Details</h3>
                          {currentImage?.metadata ? (
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-muted-foreground">Camera:</span>
                                <p>{currentImage.metadata.camera}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Lens:</span>
                                <p>{currentImage.metadata.lens}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Aperture:</span>
                                <p>{currentImage.metadata.aperture}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Shutter Speed:</span>
                                <p>{currentImage.metadata.shutterSpeed}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">ISO:</span>
                                <p>{currentImage.metadata.iso}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Focal Length:</span>
                                <p>{currentImage.metadata.focalLength}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Date:</span>
                                <p>{currentImage.metadata.dateTaken}</p>
                              </div>
                              <div>
                                <span className="font-medium text-muted-foreground">Location:</span>
                                <p>{currentImage.metadata.location}</p>
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No metadata available for this image.</p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Maximize Button */}
                    <Dialog open={isMaximized} onOpenChange={setIsMaximized}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-black/50 hover:bg-black/70 text-white border-0"
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent fullScreen className="p-0">
                        <DialogTitle className="sr-only">Fullscreen Image</DialogTitle>
                        <div className="relative w-full h-full flex items-center justify-center bg-black">
                          <Image
                            src={currentImage?.src || ''}
                            alt={currentImage?.alt || ''}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 border-border/50"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background/90 border-border/50"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
