export interface CompanyData {
  id: number
  name: string
  reg_number: string
  type: string
  details: string
  phone: string
  email: string
  website: string
  contact_person: string
  contact_phone: string
  verified: boolean
  isdeleted: boolean
  deletedAt: string | null
  created_at: string
  updated_at: string
  address: {
    id: number
    street: string
    city: string
    state: string
    country: string
    postal_code: string
    latitude: number
    longitude: number
    created_at: string
    updated_at: string
  }
  users: {
    id: number
    username: string
    email: string
    role: string
  }[]
  vehicles: {
    id: number
    plate_number: string
  }[]
}

export const companyData: CompanyData = {
  id: 1,
  name: "Vercel Logistics Inc.",
  reg_number: "123-45-67890",
  type: "Logistics & Transportation",
  details: "Providing cutting-edge logistics solutions powered by Next.js.",
  phone: "+82 10-1234-5678",
  email: "contact@vercel-logistics.com",
  website: "https://vercel.com",
  contact_person: "Jane Doe",
  contact_phone: "+82 10-8765-4321",
  verified: true,
  isdeleted: false,
  deletedAt: null,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2025-07-10T00:00:00.000Z",
  address: {
    id: 1,
    street: "Teheran-ro",
    city: "Seoul",
    state: "Gangnam-gu",
    country: "South Korea",
    postal_code: "06133",
    latitude: 37.5045,
    longitude: 127.0489,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  users: [
    { id: 1, username: "John Smith", email: "john@example.com", role: "Admin" },
    {
      id: 2,
      username: "Emily White",
      email: "emily@example.com",
      role: "Manager",
    },
    {
      id: 3,
      username: "Driver 01",
      email: "driver01@example.com",
      role: "Driver",
    },
    {
      id: 4,
      username: "Driver 02",
      email: "driver02@example.com",
      role: "Driver",
    },
  ],
  vehicles: [
    { id: 1, plate_number: "JSW-4952" },
    { id: 2, plate_number: "XPR-3384" },
    { id: 3, plate_number: "GHT-6610" },
  ],
}
