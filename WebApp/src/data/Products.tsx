const products: { [key: string]: { name: string; url: string; img?: string }[] } = {
    "ANSI A13-1": [
      { name: "Pipe Marking Labels", url: "https://www.bradyid.com/pipemarking", img: "/assets/pipe_marking.jpg" },
      { name: "Safety Signage", url: "https://www.bradyid.com/safety-signs", img: "/assets/safety_signs.jpg" },
    ],
    "ANSI Z358-1": [
      { name: "Emergency Eyewash Station", url: "https://www.bradyid.com/eyewash", img: "/assets/eyewash_station.jpg" },
      { name: "Safety Shower Equipment", url: "https://www.bradyid.com/safety-showers", img: "/assets/safety_shower.jpg" },
    ],
    "OSHA 1910-157(c)(1)": [
      { name: "Fire Extinguisher Signage", url: "https://www.bradyid.com/fire-signs", img: "/assets/fire_sign.jpg" },
      { name: "Fire Equipment Cabinets", url: "https://www.bradyid.com/fire-cabinets", img: "/assets/fire_cabinet.jpg" },
    ],
    "OSHA 1910-303(e)(1)": [
      { name: "Electrical Safety Labels", url: "https://www.bradyid.com/electrical-labels", img: "/assets/electrical_label.jpg" },
      { name: "Voltage Warning Signs", url: "https://www.bradyid.com/voltage-signs", img: "/assets/voltage_sign.jpg" },
    ],
    "OSHA 1910-303(g)(1)": [
      { name: "Electrical Clearance Signs", url: "https://www.bradyid.com/electrical-clearance", img: "/assets/electrical_clearance.jpg" },
      { name: "Lockout Tagout Devices", url: "https://www.bradyid.com/lockout", img: "/assets/lockout.jpg" },
    ],
    "OSHA 1910-37(a)(3)": [
      { name: "Exit Route Signs", url: "https://www.bradyid.com/exit-signs", img: "/assets/exit_sign.jpg" },
      { name: "Glow-in-the-Dark Exit Markings", url: "https://www.bradyid.com/glow-exit", img: "/assets/glow_exit.jpg" },
    ],
    "No Violation": [],
  };
  
  export default products;
  