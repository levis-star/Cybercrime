import React, { useEffect, useRef } from 'react';

// Approximate centre coords for every Tanzania region
const REGION_COORDS = {
  'Arusha':          [-3.387,  36.683],
  'Dar es Salaam':   [-6.792,  39.208],
  'Dodoma':          [-6.172,  35.740],
  'Geita':           [-2.872,  32.173],
  'Iringa':          [-7.769,  35.694],
  'Kagera':          [-1.998,  31.550],
  'Katavi':          [-6.363,  31.410],
  'Kigoma':          [-4.882,  29.659],
  'Kilimanjaro':     [-3.352,  37.343],
  'Lindi':           [-9.997,  39.717],
  'Manyara':         [-4.316,  36.016],
  'Mara':            [-1.756,  34.020],
  'Mbeya':           [-8.895,  33.458],
  'Morogoro':        [-6.819,  37.659],
  'Mtwara':          [-10.269, 40.183],
  'Mwanza':          [-2.517,  32.918],
  'Njombe':          [-9.333,  34.770],
  'Pemba North':     [-5.030,  39.781],
  'Pemba South':     [-5.317,  39.758],
  'Pwani':           [-7.057,  38.813],
  'Rukwa':           [-7.957,  31.399],
  'Ruvuma':          [-10.438, 36.103],
  'Shinyanga':       [-3.662,  33.428],
  'Simiyu':          [-2.837,  34.146],
  'Singida':         [-4.819,  34.750],
  'Songwe':          [-8.537,  32.479],
  'Tabora':          [-5.016,  32.801],
  'Tanga':           [-5.069,  38.952],
  'Unguja North':    [-5.767,  39.400],
  'Unguja South':    [-6.253,  39.508],
  'Unguja Urban/West': [-6.163, 39.208],
};

function severityColor(score) {
  if (score >= 70) return '#d34f3f';
  if (score >= 40) return '#f2b84b';
  return '#79b8a9';
}

export default function TanzaniaMap({ reports = [] }) {
  const containerRef = useRef(null);
  const mapRef       = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Lazy-load Leaflet so it never runs on the server
    import('leaflet').then((L) => {
      const Leaflet = L.default || L;

      // Only initialise once
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      const sw = Leaflet.latLng(-11.7, 29.5);
      const ne = Leaflet.latLng(-0.99, 40.5);
      const tanzaniaBounds = Leaflet.latLngBounds(sw, ne);

      const map = Leaflet.map(containerRef.current, {
        minZoom: 5,
        maxZoom: 13,
        maxBounds: tanzaniaBounds,
        maxBoundsViscosity: 1.0,
        scrollWheelZoom: false,
        worldCopyJump: false,
        zoomControl: true,
      });
      mapRef.current = map;

      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>',
        maxZoom: 13,
      }).addTo(map);

      // Force correct size measurement then zoom to Tanzania
      map.invalidateSize();
      map.fitBounds(tanzaniaBounds, { padding: [10, 10] });

      // Plot each report
      reports.forEach((report) => {
        let lat = report.latitude;
        let lng = report.longitude;

        // Fall back to region centre if no coords
        if (!lat || !lng) {
          const coords = REGION_COORDS[report.region];
          if (!coords) return;
          [lat, lng] = coords;
        }

        const color = severityColor(report.severityScore);

        const marker = Leaflet.circleMarker([lat, lng], {
          radius: 9,
          fillColor: color,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.85,
        }).addTo(map);

        const assignedTo = report.assignment
          ? `<br/><b>Assigned to:</b> ${report.assignment.taskForceName}<br/><b>District:</b> ${report.assignment.district}`
          : '<br/><em>Not yet assigned</em>';

        marker.bindPopup(
          `<strong>${report.trackingCode}</strong><br/>
           ${report.category}<br/>
           Region: ${report.region}${assignedTo}<br/>
           Severity: <b>${report.severityScore}</b><br/>
           Status: ${report.status}`
        );
      });

      // Add region markers for regions with no lat/lng reports
      const mappedRegions = new Set(reports.map((r) => r.region));
      Object.entries(REGION_COORDS).forEach(([region, [lat, lng]]) => {
        if (!mappedRegions.has(region)) {
          Leaflet.circleMarker([lat, lng], {
            radius: 5,
            fillColor: '#c9d9d6',
            color: '#8aada8',
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.4,
          })
            .addTo(map)
            .bindTooltip(region, { permanent: false });
        }
      });
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [reports]);

  return <div ref={containerRef} className="tanzaniaMap" />;
}
