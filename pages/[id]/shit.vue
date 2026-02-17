<template>
  <div>
    <h1>Maps</h1>
    <GoogleMap ref="mapRef" :api-key="googleMapsApiKey" class="map" :center="markerPosition"
      :zoom="15" @click="clickMap">
      <Marker ref="markerRef" :options="{ position: markerPosition }" />
    </GoogleMap>
    <input v-model="address" type="text" ref="autocompleteRef" placeholder="Enter an address" />
    <label for="lng">Longitude</label>
    <input v-model.number="lng" id="lng" type="number" min="-180" max="180" step="0.000001" />
    <label for="lat">Latitude</label>
    <input v-model.number="lat" id="lat" type="number" min="-90" max="90" step="0.000001" />

    <h2>Nearby Hospitals</h2>
    <ul>
      <li v-for="hospital in nearbyHospitals" :key="hospital.name">
        {{ hospital.name }} - {{ hospital.address }} - Rating: {{ hospital.rating }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { GoogleMap, Marker } from 'vue3-google-map';

const config = useRuntimeConfig();
const googleMapsApiKey = config.public.GOOGLE_MAPS_API_KEY;

const geocoder = ref(null);
const address = ref('');
const mapRef = ref(null);
const markerRef = ref(null);
const autocompleteRef = ref(null);

const markerPosition = ref({ lat: 29.530868, lng: -98.7571505 });

const nearbyHospitals = ref([]);

const clickMap = (e) => {
  console.log("clickMap");
  lng.value = e.latLng.lng();
  lat.value = e.latLng.lat();
  markerRef.value.marker.setPosition({ lat: lat.value, lng: lng.value });

  geocoder.value.geocode(
    { location: { lat: lat.value, lng: lng.value } },
    (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          address.value = results[0].formatted_address;
          console.log("address", address.value);
          fetchNearbyHospitals(lat.value, lng.value);
        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    }
  );
};

const fetchNearbyHospitals = (latitude, longitude) => {
  const service = new google.maps.places.PlacesService(mapRef.value.map);
  const request = {
    location: new google.maps.LatLng(latitude, longitude),
    radius: '5000',
    type: ['hospital'],
  };

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      nearbyHospitals.value = results.map((place) => ({
        name: place.name,
        address: place.vicinity,
        rating: place.rating || 'No rating',
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
      }));
      console.log(nearbyHospitals.value);
    } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
      console.log('No places found within the specified radius.');
    } else {
      console.log('Error with API status:', status);
    }
  });
};

const callbackAutocomplete = (place) => {
  lng.value = place.geometry.location.lng();
  lat.value = place.geometry.location.lat();

  markerRef.value.marker.setPosition({ lat: lat.value, lng: lng.value });
  mapRef.value.map.panTo({ lat: lat.value, lng: lng.value });
  address.value = place.formatted_address;
  fetchNearbyHospitals(lat.value, lng.value);
};

const lng = computed({
  get: () => markerPosition.value.lng,
  set: (v) => {
    if (!Number.isFinite(v)) {
      markerPosition.value.lng = 0;
    } else if (v > 180) {
      markerPosition.value.lng = 180;
    } else if (v < -180) {
      markerPosition.value.lng = -180;
    } else {
      markerPosition.value.lng = v;
    }
  },
});

const lat = computed({
  get: () => markerPosition.value.lat,
  set: (v) => {
    if (!Number.isFinite(v)) {
      markerPosition.value.lat = 0;
    } else if (v > 90) {
      markerPosition.value.lat = 90;
    } else if (v < -90) {
      markerPosition.value.lat = -90;
    } else {
      markerPosition.value.lat = v;
    }
  },
});

watch(() => mapRef.value?.ready, (ready) => {
  if (!ready) return;

  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
  };

  const autocomplete = new mapRef.value.api.places.Autocomplete(
    autocompleteRef.value,
    options
  );

  geocoder.value = new mapRef.value.api.Geocoder();

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      console.log("No details available for input: '" + place.name + "'");
      return;
    }
    callbackAutocomplete(place);
  });
});
</script>

<style scoped>
.map {
  position: relative;
  width: 100%;
  height: 500px;
}

input[type="number"] {
  width: 200px;
  margin-top: 20px;
  margin-left: 10px;
}
</style>
