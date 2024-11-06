import React, { useEffect, useState } from 'react';
import './DonationForm.css';
import LoadingDialog from '../LoadingDialog/LoadingDialog';

function DonationForm() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);

  // Add formData state to capture form input data
  const [formData, setFormData] = useState({
    name: '',
    place: '',
    phone: '',
    email: '',
    amount: '',
    description: '',
  });

  const [isLoading, setIsLoading] = useState(false); // State to track loading status
  
  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    const successCallback = (position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };

    const errorCallback = (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('User denied the request for Geolocation.');
          break;
        case error.POSITION_UNAVAILABLE:
          setError('Location information is unavailable.');
          break;
        case error.TIMEOUT:
          setError('The request to get user location timed out.');
          break;
        case error.UNKNOWN_ERROR:
          setError('An unknown error occurred.');
          break;
        default:
          setError('An unexpected error occurred while fetching the location.');
          break;
      }
    };

    // Get the user's location
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    // Optionally watch the position for updates
    const watchId = navigator.geolocation.watchPosition(successCallback, errorCallback);

    // Cleanup the watch on component unmount
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value }); // Update form data state
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the button is clicked

    // Simulate an API call or some processing
    setTimeout(() => {
      setIsLoading(false); // Reset loading after the processing is done
      console.log("Form submitted:", formData);
      console.log("Current Location:", location);
      // Handle the form submission or further processing here
    }, 3000); // Simulating a 3-second loading time
  };

  return (
    <div className="donation-section">
      {isLoading && <LoadingDialog />} {/* Show loading dialog when isLoading is true */}
      <form className="donation-form" onSubmit={handleSubmit}>
        <h2>Donate Food</h2>
        
        {error && <p className="error">{error}</p>}
        
        <label>
          Name:
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
          />
        </label>
        
        <label>
          Place:
          <input 
            type="text" 
            name="place" 
            value={formData.place} 
            onChange={handleChange} 
            required 
          />
        </label>
        
        <label>
          Phone Number:
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
          />
        </label>
        
        <label>
          Email:
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
        </label>
        
        <label>
          Amount:
          <input 
            type="number" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            required 
          />
        </label>
        
        <label>
          Description of Food:
          <textarea 
            name="description" 
            rows="4" 
            value={formData.description} 
            onChange={handleChange} 
            required
          />
        </label>

        {location.lat && location.lng ? (
          <p>Your current location: Latitude: {location.lat}, Longitude: {location.lng}</p>
        ) : (
          <p>Fetching location...</p>
        )}

        <button type="submit">Find Match</button>
      </form>
    </div>
  );
}

export default DonationForm;