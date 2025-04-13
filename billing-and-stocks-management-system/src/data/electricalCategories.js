/**
 * Predefined categories for an electrical and electronics shop
 */
export const electricalCategories = [
  {
    id: 1,
    name: 'Batteries',
    description: 'All types of batteries including inverter, UPS, and vehicle batteries',
    subcategories: [
      { id: 101, name: 'Inverter Batteries', description: 'Batteries for home inverters' },
      { id: 102, name: 'Vehicle Batteries', description: 'Batteries for cars, bikes, and other vehicles' },
      { id: 103, name: 'UPS Batteries', description: 'Batteries for UPS systems' },
      { id: 104, name: 'Rechargeable Batteries', description: 'AA, AAA and other rechargeable batteries' }
    ]
  },
  {
    id: 2,
    name: 'Power Equipment',
    description: 'Power management and backup equipment',
    subcategories: [
      { id: 201, name: 'Inverters', description: 'Home and commercial inverters' },
      { id: 202, name: 'UPS Systems', description: 'Uninterruptible Power Supply systems' },
      { id: 203, name: 'Voltage Stabilizers', description: 'Voltage regulators and stabilizers' },
      { id: 204, name: 'Solar Equipment', description: 'Solar panels and related equipment' }
    ]
  },
  {
    id: 3,
    name: 'Home Appliances',
    description: 'Electrical home appliances',
    subcategories: [
      { id: 301, name: 'Refrigerators', description: 'Fridges and freezers' },
      { id: 302, name: 'Water Heaters', description: 'Geysers and water heaters' },
      { id: 303, name: 'Air Conditioners', description: 'AC units and parts' },
      { id: 304, name: 'Fans', description: 'Ceiling, table, and exhaust fans' },
      { id: 305, name: 'Washing Machines', description: 'Washing machines and dryers' }
    ]
  },
  {
    id: 4,
    name: 'Lighting',
    description: 'Lighting equipment and accessories',
    subcategories: [
      { id: 401, name: 'LED Lights', description: 'LED bulbs and fixtures' },
      { id: 402, name: 'Tube Lights', description: 'Fluorescent and LED tube lights' },
      { id: 403, name: 'Decorative Lighting', description: 'Decorative and festive lights' },
      { id: 404, name: 'Emergency Lights', description: 'Battery-powered emergency lighting' }
    ]
  },
  {
    id: 5,
    name: 'Wiring & Accessories',
    description: 'Electrical wiring and installation accessories',
    subcategories: [
      { id: 501, name: 'Cables & Wires', description: 'Electrical cables and wires' },
      { id: 502, name: 'Switches & Sockets', description: 'Electrical switches and power sockets' },
      { id: 503, name: 'Distribution Boards', description: 'MCB boxes and distribution panels' },
      { id: 504, name: 'Circuit Breakers', description: 'MCBs, RCCBs, and fuses' }
    ]
  },
  {
    id: 6,
    name: 'Electronics',
    description: 'Electronic devices and components',
    subcategories: [
      { id: 601, name: 'Audio Equipment', description: 'Speakers, amplifiers, and sound systems' },
      { id: 602, name: 'TV & Video', description: 'Televisions and video equipment' },
      { id: 603, name: 'Electronic Components', description: 'Capacitors, resistors, and other components' },
      { id: 604, name: 'Security Systems', description: 'CCTV cameras and security equipment' }
    ]
  },
  {
    id: 7,
    name: 'Tools & Equipment',
    description: 'Tools for electrical work and testing',
    subcategories: [
      { id: 701, name: 'Hand Tools', description: 'Screwdrivers, pliers, and other hand tools' },
      { id: 702, name: 'Testing Equipment', description: 'Multimeters and testing devices' },
      { id: 703, name: 'Soldering Equipment', description: 'Soldering irons and accessories' },
      { id: 704, name: 'Safety Equipment', description: 'Gloves, goggles, and safety gear' }
    ]
  },
  {
    id: 8,
    name: 'Repair Parts',
    description: 'Spare parts for appliance repairs',
    subcategories: [
      { id: 801, name: 'Refrigerator Parts', description: 'Parts for refrigerator repair' },
      { id: 802, name: 'Washing Machine Parts', description: 'Parts for washing machine repair' },
      { id: 803, name: 'AC Parts', description: 'Parts for air conditioner repair' },
      { id: 804, name: 'Fan Parts', description: 'Parts for fan repair' },
      { id: 805, name: 'Inverter Parts', description: 'Parts for inverter repair' }
    ]
  }
];

/**
 * Repair service categories for an electrical and electronics shop
 */
export const repairServiceCategories = [
  {
    id: 1,
    name: 'Appliance Repair',
    description: 'Repair services for home appliances',
    services: [
      { id: 101, name: 'Refrigerator Repair', description: 'Diagnosis and repair of refrigerators', basePrice: 500 },
      { id: 102, name: 'Washing Machine Repair', description: 'Diagnosis and repair of washing machines', basePrice: 600 },
      { id: 103, name: 'AC Repair', description: 'Diagnosis and repair of air conditioners', basePrice: 800 },
      { id: 104, name: 'Geyser Repair', description: 'Diagnosis and repair of water heaters', basePrice: 400 },
      { id: 105, name: 'Fan Repair', description: 'Diagnosis and repair of fans', basePrice: 300 }
    ]
  },
  {
    id: 2,
    name: 'Power Equipment Repair',
    description: 'Repair services for power equipment',
    services: [
      { id: 201, name: 'Inverter Repair', description: 'Diagnosis and repair of inverters', basePrice: 700 },
      { id: 202, name: 'UPS Repair', description: 'Diagnosis and repair of UPS systems', basePrice: 600 },
      { id: 203, name: 'Stabilizer Repair', description: 'Diagnosis and repair of voltage stabilizers', basePrice: 400 },
      { id: 204, name: 'Battery Service', description: 'Battery testing and maintenance', basePrice: 300 }
    ]
  },
  {
    id: 3,
    name: 'Electronics Repair',
    description: 'Repair services for electronic devices',
    services: [
      { id: 301, name: 'TV Repair', description: 'Diagnosis and repair of televisions', basePrice: 800 },
      { id: 302, name: 'Audio Equipment Repair', description: 'Diagnosis and repair of audio systems', basePrice: 600 },
      { id: 303, name: 'Circuit Board Repair', description: 'Repair of electronic circuit boards', basePrice: 1000 },
      { id: 304, name: 'Security System Repair', description: 'Repair of CCTV and security systems', basePrice: 700 }
    ]
  },
  {
    id: 4,
    name: 'Installation Services',
    description: 'Installation services for electrical equipment',
    services: [
      { id: 401, name: 'AC Installation', description: 'Installation of air conditioners', basePrice: 1500 },
      { id: 402, name: 'Inverter Installation', description: 'Installation of inverters and batteries', basePrice: 1000 },
      { id: 403, name: 'Wiring Installation', description: 'Electrical wiring installation', basePrice: 2000 },
      { id: 404, name: 'Appliance Installation', description: 'Installation of home appliances', basePrice: 800 }
    ]
  },
  {
    id: 5,
    name: 'Maintenance Services',
    description: 'Regular maintenance services',
    services: [
      { id: 501, name: 'AC Servicing', description: 'Regular maintenance of air conditioners', basePrice: 600 },
      { id: 502, name: 'Refrigerator Servicing', description: 'Regular maintenance of refrigerators', basePrice: 500 },
      { id: 503, name: 'Washing Machine Servicing', description: 'Regular maintenance of washing machines', basePrice: 500 },
      { id: 504, name: 'Inverter & Battery Maintenance', description: 'Regular maintenance of inverters and batteries', basePrice: 400 }
    ]
  }
];

/**
 * Common repair issues and their solutions
 */
export const commonRepairIssues = [
  {
    category: 'Refrigerator',
    issues: [
      { issue: 'Not cooling properly', solution: 'Check compressor, clean condenser coils, check refrigerant level', estimatedCost: '800-1500' },
      { issue: 'Making unusual noise', solution: 'Check fan motor, compressor mounts, or leveling', estimatedCost: '500-1000' },
      { issue: 'Water leakage', solution: 'Clear drain line, check door seal, defrost system check', estimatedCost: '400-800' },
      { issue: 'Not running at all', solution: 'Check power supply, thermostat, or compressor relay', estimatedCost: '600-1200' }
    ]
  },
  {
    category: 'Air Conditioner',
    issues: [
      { issue: 'Not cooling', solution: 'Clean filters, check refrigerant, clean evaporator coils', estimatedCost: '1000-2000' },
      { issue: 'Water leakage', solution: 'Clear drain line, check installation slope', estimatedCost: '500-800' },
      { issue: 'Unusual noise', solution: 'Check fan motor, compressor, or loose parts', estimatedCost: '800-1500' },
      { issue: 'Not turning on', solution: 'Check power, capacitor, or control board', estimatedCost: '700-1500' }
    ]
  },
  {
    category: 'Washing Machine',
    issues: [
      { issue: 'Not spinning', solution: 'Check belt, motor, or lid switch', estimatedCost: '800-1500' },
      { issue: 'Water not filling', solution: 'Check inlet valves, water pressure, or filters', estimatedCost: '600-1000' },
      { issue: 'Leaking water', solution: 'Check hoses, door seal, or pump', estimatedCost: '500-1200' },
      { issue: 'Excessive vibration', solution: 'Balance load, check suspension or leveling', estimatedCost: '400-800' }
    ]
  },
  {
    category: 'Inverter',
    issues: [
      { issue: 'Not providing backup', solution: 'Check battery, connections, or charging circuit', estimatedCost: '800-1500' },
      { issue: 'Alarm beeping', solution: 'Check battery voltage, load, or overheating', estimatedCost: '500-800' },
      { issue: 'Shutting down unexpectedly', solution: 'Check overload protection, battery, or cooling fan', estimatedCost: '700-1200' },
      { issue: 'Not charging battery', solution: 'Check charger circuit, battery terminals, or settings', estimatedCost: '600-1000' }
    ]
  },
  {
    category: 'Water Heater/Geyser',
    issues: [
      { issue: 'No hot water', solution: 'Check heating element, thermostat, or power supply', estimatedCost: '600-1200' },
      { issue: 'Water too hot/cold', solution: 'Adjust thermostat, check thermostat function', estimatedCost: '400-700' },
      { issue: 'Leaking water', solution: 'Check pressure valve, tank integrity, or connections', estimatedCost: '500-1500' },
      { issue: 'Making noise', solution: 'Check heating element, sediment buildup, or pressure', estimatedCost: '500-900' }
    ]
  }
];

/**
 * Parts commonly used in repairs
 */
export const commonRepairParts = [
  // Refrigerator parts
  { id: 1001, name: 'Compressor', category: 'Refrigerator Parts', price: 3500, warranty: '1 year' },
  { id: 1002, name: 'Thermostat', category: 'Refrigerator Parts', price: 800, warranty: '6 months' },
  { id: 1003, name: 'Door Seal/Gasket', category: 'Refrigerator Parts', price: 1200, warranty: '6 months' },
  { id: 1004, name: 'Condenser Fan Motor', category: 'Refrigerator Parts', price: 1500, warranty: '1 year' },
  { id: 1005, name: 'Defrost Timer', category: 'Refrigerator Parts', price: 900, warranty: '6 months' },
  
  // AC parts
  { id: 2001, name: 'Compressor', category: 'AC Parts', price: 4500, warranty: '1 year' },
  { id: 2002, name: 'Capacitor', category: 'AC Parts', price: 600, warranty: '6 months' },
  { id: 2003, name: 'PCB/Control Board', category: 'AC Parts', price: 2500, warranty: '1 year' },
  { id: 2004, name: 'Fan Motor', category: 'AC Parts', price: 1800, warranty: '1 year' },
  { id: 2005, name: 'Refrigerant Gas Refill', category: 'AC Parts', price: 1200, warranty: '3 months' },
  
  // Washing machine parts
  { id: 3001, name: 'Motor', category: 'Washing Machine Parts', price: 2800, warranty: '1 year' },
  { id: 3002, name: 'Belt', category: 'Washing Machine Parts', price: 400, warranty: '6 months' },
  { id: 3003, name: 'Water Pump', category: 'Washing Machine Parts', price: 1200, warranty: '1 year' },
  { id: 3004, name: 'Door Lock', category: 'Washing Machine Parts', price: 800, warranty: '6 months' },
  { id: 3005, name: 'Control Board', category: 'Washing Machine Parts', price: 2200, warranty: '1 year' },
  
  // Inverter parts
  { id: 4001, name: 'Transformer', category: 'Inverter Parts', price: 1800, warranty: '1 year' },
  { id: 4002, name: 'Control Board', category: 'Inverter Parts', price: 2500, warranty: '1 year' },
  { id: 4003, name: 'Cooling Fan', category: 'Inverter Parts', price: 600, warranty: '6 months' },
  { id: 4004, name: 'Battery Terminals', category: 'Inverter Parts', price: 300, warranty: '3 months' },
  { id: 4005, name: 'Charging Circuit', category: 'Inverter Parts', price: 1500, warranty: '1 year' },
  
  // Water heater/geyser parts
  { id: 5001, name: 'Heating Element', category: 'Water Heater Parts', price: 1200, warranty: '1 year' },
  { id: 5002, name: 'Thermostat', category: 'Water Heater Parts', price: 700, warranty: '6 months' },
  { id: 5003, name: 'Safety Valve', category: 'Water Heater Parts', price: 500, warranty: '6 months' },
  { id: 5004, name: 'Anode Rod', category: 'Water Heater Parts', price: 800, warranty: '1 year' },
  { id: 5005, name: 'Temperature Control', category: 'Water Heater Parts', price: 900, warranty: '6 months' }
];