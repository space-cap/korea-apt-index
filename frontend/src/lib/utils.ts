import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const customTwMerge = extendTailwindMerge({
    extend: {
      theme: {
        colors: [{
          indigo: ['50', '600'],
          rose: ['500'],
          blue: ['500'],
          slate: ['50', '400', '500', '800', '900'],
        }]
      }
    }
  })

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}
