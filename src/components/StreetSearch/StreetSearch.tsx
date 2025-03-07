import { useState } from 'react';
import axios from 'axios';

export const StreetSearch = () => {
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log('results', results)
    const handleSearch = async () => {
        if (!city || !street) {
            alert('Пожалуйста, введите город и улицу');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?street=${street}&city=${city}&format=json&addressdetails=1&accept-language=ru`
            );

            setResults(response.data);
        } catch (error) {
            console.error('Ошибка при поиске улицы:', error);
            alert('Произошла ошибка при поиске');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Поиск улицы в городе</h1>
            <div>
                <input
                    type="text"
                    placeholder="Введите город"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Введите улицу"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
                <button onClick={handleSearch} disabled={loading}>
                    {loading ? 'Загружается...' : 'Искать'}
                </button>
            </div>

            {results.length > 0 && (
                <div>
                    <h2>Результаты:</h2>
                    <ul>
                        {results.map((result: any, index) => (
                            <li key={index}>
                                {result.display_name} <br />
                                <strong>Географические координаты:</strong> {result.lat}, {result.lon}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}