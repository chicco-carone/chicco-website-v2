import React from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface UserImageProps {
    src: string;
    alt: string;
    size?: number;
    spin?: boolean;
}

export const UserImage: React.FC<UserImageProps> = ({
    src,
    alt,
    size = 50,
    spin = false,
}) => {
    return (
      <motion.div
        animate={spin ? { rotate: 360 } : {}}
        transition={spin ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
        className={`overflow-hidden rounded-full`}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </motion.div>
    );
    }