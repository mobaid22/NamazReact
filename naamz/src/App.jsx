import Prayer from "./comp/prayer"
import { useState, useEffect } from "react"

function App() {
  const [currentDate, setCurrentDate] = useState("")
  const [city, setCity] = useState("Istanbul")
  const [prayerTimes, setPrayerTimes] = useState({})

  const cities = ["kırıkkale", "Istanbul", "Ankara", "Izmir", "Bursa", "Konya"]

  useEffect(() => {
    const today = new Date()

    // Tarihi manuel olarak biçimlendiriyoruz
    const day = today.getDate()
    const month = today.toLocaleString('tr-TR', { month: 'long' })
    const year = today.getFullYear()
    const weekday = today.toLocaleString('tr-TR', { weekday: 'long' })

    // "Pazartesi, 1 Ocak 2023" formatında birleştiriyoruz
    const formattedDate = `${weekday}, ${day} ${month} ${year}`
    setCurrentDate(formattedDate)
  }, [])
  // 24 saat formatını AM/PM formatına dönüştüren fonksiyon
  const convertTo12HourFormat = (time24) => {
    if (!time24) return "";

    // "HH:MM" formatındaki zaman dizesini ayırıyoruz
    const [hours, minutes] = time24.split(':');

    // Saat değerini sayıya dönüştürüyoruz
    let hour = parseInt(hours);

    // AM/PM belirleme
    const ampm = hour >= 12 ? 'PM' : 'AM';

    // 12 saat formatına dönüştürme
    hour = hour % 12;
    hour = hour ? hour : 12; // 0 saati 12 olarak göster

    // Sonucu "HH:MM AM/PM" formatında döndür
    return `${hour}:${minutes} ${ampm}`;
  }

  useEffect(() => {
    // API'den namaz vakitlerini al
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Turkey&method=13`)
      .then(res => res.json())
      .then(data => {
        // API'den gelen vakitleri AM/PM formatına dönüştür
        const timings = data.data.timings;
        const formattedTimings = {
          Fajr: convertTo12HourFormat(timings.Fajr),
          Dhuhr: convertTo12HourFormat(timings.Dhuhr),
          Asr: convertTo12HourFormat(timings.Asr),
          Maghrib: convertTo12HourFormat(timings.Maghrib),
          Isha: convertTo12HourFormat(timings.Isha)
        };

        setPrayerTimes(formattedTimings);
      })
      .catch(error => {
        console.error("Namaz vakitleri alınamadı:", error)
      })
  }, [city])

  const handleCityChange = (e) => {
    setCity(e.target.value)
  }

  return (
    <section>
      <div className="countainer">
        <div className="top_sec">
          <div className="city">
            <h1>{city}</h1>
            <select className="city-select" value={city} onChange={handleCityChange}>
              <option value="">-- Select a city --</option>
              {cities.map((cityName, index) => (
                <option key={index} value={cityName}>{cityName}</option>
              ))}
            </select>
          </div>
          <div className="date">
            <h1>{currentDate}</h1>
          </div>
        </div>

        <div className="prayer_times">
          <Prayer name="İmsak" date={prayerTimes.Fajr} />
          <Prayer name="Öğle" date={prayerTimes.Dhuhr} />
          <Prayer name="İkindi" date={prayerTimes.Asr} />
          <Prayer name="Akşam" date={prayerTimes.Maghrib} />
          <Prayer name="Yatsı" date={prayerTimes.Isha} />
        </div>
      </div>
    </section>
  )
}

export default App
