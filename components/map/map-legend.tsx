import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function MapLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Map Legend</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Marker Sizes */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Scholar Count</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
                1
              </div>
              <span className="text-sm text-gray-700">1-4 scholars</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-bold">
                5
              </div>
              <span className="text-sm text-gray-700">5-9 scholars</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-sm font-bold">
                10
              </div>
              <span className="text-sm text-gray-700">10+ scholars</span>
            </div>
          </div>
        </div>

        {/* Time Period Colors */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Time Periods</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-red-600 rounded-full border border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">15th-16th Century</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-blue-600 rounded-full border border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">17th-18th Century</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-green-600 rounded-full border border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">19th-20th Century</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-gray-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-sm text-gray-700">Mixed/Unknown</span>
            </div>
          </div>
        </div>

        {/* Map Features */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Features</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>• Click markers for detailed information</p>
            <p>• Zoom and pan to explore regions</p>
            <p>• Larger markers = more scholars</p>
            <p>• Colors indicate primary time period</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}