  import React, { useState, useEffect } from 'react';
  import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import axios from '../utils/axiosConfig';
  import { useNavigate } from 'react-router-dom';

  interface CountryData {
    country: string;
    flag: string;
    continent: string;
  }

  const GamePage: React.FC = () => {
    const [currentCountry, setCurrentCountry] = useState<CountryData | null>(null);
    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [showAccountDetails, setShowAccountDetails] = useState(false);
    const [accountDetails, setAccountDetails] = useState({ highScore: 0, lifetimeCorrect: 0 });
    const [hintLevel, setHintLevel] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
      fetchRandomCountry();
      fetchAccountDetails();
    }, []);

    const fetchRandomCountry = async () => {
      try {
        const response = await axios.get('/game/question');
        setCurrentCountry(response.data);
        setHintLevel(0); 
      } catch (error) {
        console.error('error fetching country');
      }
    };

    // fetch updated user details
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get('/users/account');
        setAccountDetails(response.data);
      } catch (error) {
        console.error('error fetching account details');
      }
    };

    // update the user model
    const updateAccountDetails = async () => {
      try {
        await axios.post('/users/update-score', {
          score,
        });
        fetchAccountDetails(); 
      } catch (error) {
        console.error('error updating account details:');
      }
    };

    // check user's submission 
    const handleSubmit = async () => {
      if (!markerPosition) return;

      try {
        const response = await axios.post('/game/submit-answer', {
          selectedLatLng: markerPosition,
          currentCountry,
        });

        const { isCorrect } = response.data;

        if (isCorrect) {
          setScore((prevScore) => prevScore + 1);
          fetchRandomCountry();
        } else {
          setGameOver(true);
          await updateAccountDetails();
        }

        setMarkerPosition(null);
      } catch (error) {
        console.error('error checking answer:', error);
      }
    };

    const restartGame = () => {
      setScore(0);
      setGameOver(false);
      fetchRandomCountry();
    };

    const handleHint = () => {
      if (hintLevel < 2) {
        setHintLevel(hintLevel + 1);
      }
    };

    const handleLogout = () => {
      // clearing JWT token
      localStorage.removeItem('token');
      navigate('/login');
    };

    function MapEvents() {
      useMapEvents({
        click(e) {
          setMarkerPosition([e.latlng.lat, e.latlng.lng]);
        },
      });
      return null;
    }

    // marker on map
    const customIcon = new L.Icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">Geography Trivia</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowAccountDetails(!showAccountDetails)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                  >
                    <span>Account</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-800"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              </div>

              {showAccountDetails && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <h2 className="text-lg font-semibold text-blue-800 mb-2">Account Details</h2>
                  <p>High Score: {accountDetails.highScore}</p>
                  <p>Lifetime Correct Answers: {accountDetails.lifetimeCorrect}</p>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:space-x-8">
                <div className="lg:w-1/3 mb-6 lg:mb-0">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="flex items-center text-lg font-semibold text-blue-800 mb-4">
                      Current Score: {score}
                    </p>
                    {currentCountry && !gameOver && (
                      <>
                        <p className="text-xl font-semibold mb-4">Find this country: {currentCountry.country}</p>
                        <div className="mb-4">
                          <button
                            onClick={handleHint}
                            disabled={hintLevel >= 2}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            {hintLevel === 0 ? "Get Hint" : hintLevel === 1 ? "Get Another Hint" : "No More Hints"}
                          </button>
                        </div>
                        {hintLevel >= 1 && (
                          <div className="mb-4">
                            <p className="font-semibold mb-2">Hint 1: Flag</p>
                            <img src={currentCountry.flag} alt={`Flag of ${currentCountry.country}`} className="w-full h-auto rounded-md shadow-sm" />
                          </div>
                        )}
                        {hintLevel >= 2 && (
                          <div className="mb-4">
                            <p className="font-semibold mb-2">Hint 2: Continent</p>
                            <p className="bg-white rounded-md p-2 shadow-sm">{currentCountry.continent}</p>
                          </div>
                        )}
                      </>
                    )}
                    {gameOver ? (
                      <div>
                        <p className="text-xl font-semibold mb-4">Game Over! Your final score: {score}</p>
                        <button
                          onClick={restartGame}
                          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Play Again
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleSubmit}
                        disabled={!markerPosition}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Answer
                      </button>
                    )}
                  </div>
                </div>
                <div className="lg:w-2/3">
                  <div className="h-[calc(100vh-16rem)] w-full rounded-lg overflow-hidden">
                    <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <MapEvents />
                      {markerPosition && <Marker position={markerPosition} icon={customIcon} />}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default GamePage;