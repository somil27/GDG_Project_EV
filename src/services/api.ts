// Mock API service - simulates backend calls

export interface Station {
  id: string;
  name: string;
  lat: number;
  lon: number;
  type: 'fast' | 'slow' | 'swap';
  slotsTotal: number;
  slotsAvailable: number;
  pricePerKwh: number;
  rating: number;
  hostId: string;
  hostName: string;
  status: 'online' | 'offline' | 'maintenance';
  address: string;
  amenities: string[];
  images: string[];
  predictedWaitTime: number;
}

export interface Booking {
  id: string;
  userId: string;
  stationId: string;
  stationName: string;
  startTime: string;
  endTime: string;
  slotNo: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  amount: number;
  ecoPointsEarned: number;
  qrCode: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
  transactionId: string;
}

// Mock stations data
const mockStations: Station[] = [
  {
    id: '1',
    name: 'Green Energy Hub - Koramangala',
    lat: 12.9352,
    lon: 77.6245,
    type: 'fast',
    slotsTotal: 8,
    slotsAvailable: 3,
    pricePerKwh: 12,
    rating: 4.8,
    hostId: '2',
    hostName: 'Green Energy Co.',
    status: 'online',
    address: '123 Main Road, Koramangala, Bangalore - 560034',
    amenities: ['WiFi', 'Cafe', 'Restroom', 'Waiting Area'],
    images: [],
    predictedWaitTime: 12
  },
  {
    id: '2',
    name: 'EV Point - Indiranagar',
    lat: 12.9716,
    lon: 77.6412,
    type: 'fast',
    slotsTotal: 6,
    slotsAvailable: 2,
    pricePerKwh: 15,
    rating: 4.5,
    hostId: '2',
    hostName: 'Private Host',
    status: 'online',
    address: '45 Park Street, Indiranagar, Bangalore - 560038',
    amenities: ['WiFi', 'Parking'],
    images: [],
    predictedWaitTime: 18
  },
  {
    id: '3',
    name: 'Battery Swap Station - HSR Layout',
    lat: 12.9116,
    lon: 77.6382,
    type: 'swap',
    slotsTotal: 4,
    slotsAvailable: 4,
    pricePerKwh: 0,
    rating: 4.9,
    hostId: '2',
    hostName: 'SwapTech Solutions',
    status: 'online',
    address: '78 Sector 2, HSR Layout, Bangalore - 560102',
    amenities: ['Quick Service', 'Batteries Available', 'Restroom'],
    images: [],
    predictedWaitTime: 5
  },
  {
    id: '4',
    name: 'PowerCharge - MG Road',
    lat: 12.9756,
    lon: 77.6069,
    type: 'fast',
    slotsTotal: 10,
    slotsAvailable: 6,
    pricePerKwh: 18,
    rating: 4.6,
    hostId: '2',
    hostName: 'PowerCharge Network',
    status: 'online',
    address: 'MG Road Metro Station, Bangalore - 560001',
    amenities: ['WiFi', 'Cafe', 'Shopping', 'Restroom'],
    images: [],
    predictedWaitTime: 8
  },
  {
    id: '5',
    name: 'Home Charger - Whitefield',
    lat: 12.9698,
    lon: 77.7500,
    type: 'slow',
    slotsTotal: 2,
    slotsAvailable: 1,
    pricePerKwh: 8,
    rating: 4.3,
    hostId: '2',
    hostName: 'Ramesh Kumar',
    status: 'online',
    address: 'Villa 23, Green Gardens, Whitefield, Bangalore - 560066',
    amenities: ['Parking', 'Home Environment'],
    images: [],
    predictedWaitTime: 25
  },
  {
    id: '6',
    name: 'EcoCharge Hub - Electronic City',
    lat: 12.8456,
    lon: 77.6603,
    type: 'fast',
    slotsTotal: 12,
    slotsAvailable: 8,
    pricePerKwh: 14,
    rating: 4.7,
    hostId: '2',
    hostName: 'EcoCharge Ltd',
    status: 'online',
    address: 'Phase 1, Electronic City, Bangalore - 560100',
    amenities: ['WiFi', 'Food Court', 'Restroom', 'Lounge'],
    images: [],
    predictedWaitTime: 10
  }
];

let mockBookings: Booking[] = [];

export const api = {
  // Stations
  getStations: async (): Promise<Station[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockStations;
  },

  getStationById: async (id: string): Promise<Station | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStations.find(s => s.id === id);
  },

  getPredictedWaitTime: async (stationId: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const station = mockStations.find(s => s.id === stationId);
    return station?.predictedWaitTime || 15;
  },

  // Bookings
  createBooking: async (bookingData: {
    userId: string;
    stationId: string;
    startTime: string;
    endTime: string;
  }): Promise<Booking> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const station = mockStations.find(s => s.id === bookingData.stationId);
    if (!station) throw new Error('Station not found');
    
    const booking: Booking = {
      id: 'BKG' + Date.now(),
      userId: bookingData.userId,
      stationId: bookingData.stationId,
      stationName: station.name,
      startTime: bookingData.startTime,
      endTime: bookingData.endTime,
      slotNo: Math.floor(Math.random() * station.slotsTotal) + 1,
      status: 'pending',
      amount: station.pricePerKwh * 20, // Assuming 20 kWh
      ecoPointsEarned: Math.floor(station.pricePerKwh * 2),
      qrCode: 'QR' + Date.now()
    };
    
    mockBookings.push(booking);
    return booking;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return mockBookings.filter(b => b.userId === userId);
  },

  getBookingById: async (bookingId: string): Promise<Booking | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBookings.find(b => b.id === bookingId);
  },

  // Payment
  processPayment: async (bookingId: string, amount: number): Promise<Transaction> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const booking = mockBookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'confirmed';
    }
    
    return {
      id: 'TXN' + Date.now(),
      bookingId,
      amount,
      status: 'success',
      timestamp: new Date().toISOString(),
      transactionId: 'PAY' + Date.now()
    };
  },

  // Host operations
  createStation: async (stationData: Partial<Station>): Promise<Station> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newStation: Station = {
      id: 'STN' + Date.now(),
      name: stationData.name || 'New Station',
      lat: stationData.lat || 12.9716,
      lon: stationData.lon || 77.5946,
      type: stationData.type || 'fast',
      slotsTotal: stationData.slotsTotal || 4,
      slotsAvailable: stationData.slotsTotal || 4,
      pricePerKwh: stationData.pricePerKwh || 12,
      rating: 5.0,
      hostId: stationData.hostId || '2',
      hostName: stationData.hostName || 'Host',
      status: 'online',
      address: stationData.address || '',
      amenities: stationData.amenities || [],
      images: stationData.images || [],
      predictedWaitTime: 0
    };
    
    mockStations.push(newStation);
    return newStation;
  },

  getHostStations: async (hostId: string): Promise<Station[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStations.filter(s => s.hostId === hostId);
  },

  getStationBookings: async (stationId: string): Promise<Booking[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockBookings.filter(b => b.stationId === stationId);
  },

  // Admin
  getAdminStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      totalUsers: 1247,
      totalBookings: mockBookings.length + 856,
      totalRevenue: 45678,
      activeStations: mockStations.filter(s => s.status === 'online').length,
      utilizationRate: 68,
      ecoPointsIssued: 12450
    };
  },

  getBookingTrends: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [
      { date: '2024-01-20', bookings: 45 },
      { date: '2024-01-21', bookings: 52 },
      { date: '2024-01-22', bookings: 48 },
      { date: '2024-01-23', bookings: 65 },
      { date: '2024-01-24', bookings: 71 },
      { date: '2024-01-25', bookings: 58 },
      { date: '2024-01-26', bookings: 83 }
    ];
  },

  getRevenueTrends: async () => {
    await new Promise(resolve => setTimeout(resolve, 250));
    return [
      { month: 'Jul', revenue: 4200 },
      { month: 'Aug', revenue: 5100 },
      { month: 'Sep', revenue: 4800 },
      { month: 'Oct', revenue: 6200 },
      { month: 'Nov', revenue: 7500 },
      { month: 'Dec', revenue: 8900 },
      { month: 'Jan', revenue: 10200 }
    ];
  }
};
