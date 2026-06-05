const GMP_KEY = "AIzaSyAEvk6_Aw3uhpBhY_LBcBWSSqbIoSlsDfM";

async function testGoogleMapsKey() {
  console.log("Testing Google Maps API Key...");
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${GMP_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      console.log("✅ Google Maps API Key is working!");
      console.log("Found Address:", data.results[0].formatted_address);
    } else if (data.status === "REQUEST_DENIED") {
      console.log(
        "❌ Google Maps API Key denied: " +
          (data.error_message || "Check if Geocoding API is enabled."),
      );
    } else {
      console.log("❌ Google Maps API Key status:", data.status);
      if (data.error_message) console.log("Error Message:", data.error_message);
    }
  } catch (error) {
    console.error("❌ Network or Fetch Error:", error);
  }
}

testGoogleMapsKey();
