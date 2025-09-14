import { useState } from 'react';

export interface DetectResult {
  name?: string;
  type?: 'top' | 'bottom' | 'shoes' | 'outer' | 'accessory';
  brand?: string;
  colors?: string[];
  seasons?: string[];
  occasions?: string[];
  tags?: string[];
}

export const useClothDetect = () => {
  const [isDetecting, setIsDetecting] = useState(false);

  const detectCloth = async (image: File): Promise<DetectResult> => {
    setIsDetecting(true);
    
    try {
      // Mock AI API call - simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock different results based on image name/type for demo
      const mockResults: DetectResult[] = [
        {
          name: "White Cotton T-Shirt",
          type: "top",
          brand: "Uniqlo",
          colors: ["white"],
          seasons: ["summer", "spring"],
          occasions: ["casual"],
          tags: ["cotton", "basic"]
        },
        {
          name: "Dark Wash Jeans",
          type: "bottom",
          brand: "Levi's",
          colors: ["dark-blue"],
          seasons: ["fall", "winter", "spring"],
          occasions: ["casual", "smart"],
          tags: ["denim", "versatile"]
        },
        {
          name: "Navy Blazer",
          type: "outer",
          brand: "Zara",
          colors: ["navy"],
          seasons: ["fall", "winter", "spring"],
          occasions: ["smart", "formal"],
          tags: ["blazer", "professional"]
        },
        {
          name: "White Sneakers",
          type: "shoes",
          brand: "Nike",
          colors: ["white"],
          seasons: ["all"],
          occasions: ["casual", "active"],
          tags: ["sneakers", "comfortable"]
        }
      ];

      // Return random mock result
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      return randomResult;
    } finally {
      setIsDetecting(false);
    }
  };

  return {
    detectCloth,
    isDetecting
  };
};