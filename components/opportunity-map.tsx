'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icons
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Create custom colored icons for different categories
const createCategoryIcon = (category: string) => {
  const categoryColors: Record<string, string> = {
    'Agriculture': '#2D7A4E',
    'Tech': '#1E40AF',
    'Training': '#DC2626',
    'Local Jobs': '#7C3AED',
    'Construction': '#EA580C',
    'Healthcare': '#0891B2',
    'Services': '#6B21A8',
  }

  const color = categoryColors[category] || '#4B5563'

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-items: center;
        font-weight: bold;
        color: white;
        font-size: 12px;
      ">
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

interface Opportunity {
  id: string
  title: string
  category: string
  location: string
  region: string
  salary_min?: number
  salary_max?: number
  latitude?: number
  longitude?: number
}

interface OpportunityMapProps {
  opportunities: Opportunity[]
  selectedCategory?: string | null
  selectedRegion?: string | null
  onMarkerClick?: (opportunity: Opportunity) => void
}

// Cameroon regions and their approximate coordinates
const cameroonRegions: Record<string, [number, number]> = {
  'Adamawa': [9.3077, 13.3543],
  'Centre': [3.8667, 11.5167],
  'East': [4.4092, 14.4942],
  'Far North': [10.8910, 14.2679],
  'Littoral': [4.0511, 9.7679],
  'North': [8.7674, 12.5551],
  'North-West': [5.9631, 10.1591],
  'South': [2.4381, 10.1591],
  'South-West': [4.0084, 9.1881],
  'West': [5.9631, 10.1591],
}

const CAMEROON_CENTER: [number, number] = [5.7, 12.7]
const CAMEROON_BOUNDS: [[number, number], [number, number]] = [
  [1.65, 8.45],
  [13.1, 16.25],
]

export function OpportunityMap({
  opportunities,
  selectedCategory,
  selectedRegion,
  onMarkerClick,
}: OpportunityMapProps) {
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>(opportunities)
  const [mapKey, setMapKey] = useState(0)

  useEffect(() => {
    let filtered = opportunities

    if (selectedCategory) {
      filtered = filtered.filter(opp => opp.category === selectedCategory)
    }

    if (selectedRegion) {
      filtered = filtered.filter(opp => opp.region === selectedRegion)
    }

    setFilteredOpportunities(filtered)
  }, [opportunities, selectedCategory, selectedRegion])

  // Assign coordinates to opportunities based on region
  const oppWithCoordinates = filteredOpportunities.map(opp => {
    if (opp.latitude && opp.longitude) {
      return opp
    }

    // Get region coordinates with slight random offset to avoid overlapping pins
    const regionCoords = cameroonRegions[opp.region] || cameroonRegions['Centre']
    const offsetLat = (Math.random() - 0.5) * 0.5
    const offsetLng = (Math.random() - 0.5) * 0.5

    return {
      ...opp,
      latitude: regionCoords[0] + offsetLat,
      longitude: regionCoords[1] + offsetLng,
    }
  })

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-border">
      <MapContainer
        key={mapKey}
        center={CAMEROON_CENTER}
        zoom={6}
        minZoom={6}
        maxZoom={14}
        maxBounds={CAMEROON_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ height: 'clamp(350px, 60vh, 600px)', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {oppWithCoordinates.map(opportunity => (
          <Marker
            key={opportunity.id}
            position={[opportunity.latitude || 0, opportunity.longitude || 0]}
            icon={createCategoryIcon(opportunity.category)}
            eventHandlers={{
              click: () => onMarkerClick?.(opportunity),
            }}
          >
            <Popup>
              <div className="w-56 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm text-foreground flex-1">{opportunity.title}</h3>
                  <span className="text-xs font-medium px-2 py-1 bg-primary text-primary-foreground rounded">
                    {opportunity.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{opportunity.location}</p>
                {opportunity.salary_min && opportunity.salary_max && (
                  <p className="text-xs font-medium text-primary">
                    {opportunity.salary_min}k - {opportunity.salary_max}k CFA
                  </p>
                )}
                <Link href={`/opportunities/${opportunity.id}`}>
                  <Button size="sm" className="w-full mt-2">
                    View Details
                  </Button>
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
