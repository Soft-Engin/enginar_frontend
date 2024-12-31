import * as React from "react";
import EventMini from "./EventMini";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { LoadingErrorDisplay } from "./LoadingErrorDisplay";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import "dayjs/locale/en";
import Stack from "@mui/material/Stack";

export default function EventHub() {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [errorMore, setErrorMore] = React.useState(null);

  const [locationData, setLocationData] = React.useState({
    countries: [],
    cities: [],
    districts: [],
  });

  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [selectedCities, setSelectedCities] = React.useState([]);
  const [selectedDistricts, setSelectedDistricts] = React.useState([]);
  const [fromDate, setFromDate] = React.useState(dayjs()); // Default from date to now

  const [pageNumber, setPageNumber] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const pageSize = 8;

  // Sorting parameters - hardcoded for now
  const sortBy = "date";

  // Move scroll timeout to ref to preserve it between renders
  const scrollTimeoutRef = React.useRef(null);

  // Create a ref for the current search parameters
  const searchParamsRef = React.useRef({
    selectedCountry: "",
    selectedCities: [],
    selectedDistricts: [],
    fromDate: dayjs(), // Default from date to now
  });

  const fetchEvents = React.useCallback(
    async (isNewSearch = false) => {
      if (loadingMore && !isNewSearch) return;

      const currentPage = isNewSearch ? 1 : pageNumber;

      if (isNewSearch) {
        setEvents([]);
        setPageNumber(1);
      }

      setLoadingMore(!isNewSearch);
      setLoading(isNewSearch);
      setErrorMore(null);

      try {
        // Use the ref values for constructing parameters
        const params = {
          pageNumber: currentPage,
          pageSize: pageSize,
          SortBy: sortBy, // Added sorting
        };

        if (searchParamsRef.current.selectedCountry) {
          params.CountryIds = [searchParamsRef.current.selectedCountry];
        }

        if (searchParamsRef.current.selectedCities?.length > 0) {
          params.CityIds = searchParamsRef.current.selectedCities;
        }

        if (searchParamsRef.current.selectedDistricts?.length > 0) {
          params.DistrictIds = searchParamsRef.current.selectedDistricts;
        }
        //if no toDate is specified send the fromDate to only receive current and future events
        if (searchParamsRef.current.fromDate) {
          params.FromDate =
            searchParamsRef.current.fromDate.format("YYYY-MM-DD");
        }

        const eventsResponse = await axios.get(
          `/api/v1/events/search?${new URLSearchParams(params).toString()}`
        );

        if (eventsResponse.data && eventsResponse.data.items) {
          setEvents((prev) =>
            isNewSearch
              ? eventsResponse.data.items
              : [...prev, ...eventsResponse.data.items]
          );

          setTotalPages(Math.ceil(eventsResponse.data.totalCount / pageSize));
          if (!isNewSearch) {
            setPageNumber((curr) => curr + 1);
          }
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setErrorMore(err.message || "An unexpected error occurred.");
      } finally {
        setLoadingMore(false);
        setLoading(false);
      }
    },
    [pageNumber, loadingMore, sortBy] // Include sort params in dependencies
  );

  // Watch for changes in search parameters
  React.useEffect(() => {
    // Use the most recent fromDate, defaulting to today if null
    const currentFromDate = fromDate || dayjs();

    searchParamsRef.current = {
      selectedCountry,
      selectedCities,
      selectedDistricts,
      fromDate: currentFromDate,
    };
    fetchEvents(true);
  }, [selectedCountry, selectedCities, selectedDistricts, fromDate]);

  const fetchAllLocationData = async () => {
    try {
      const countriesResponse = await axios.get("/api/v1/events/countries");
      const countries = countriesResponse.data;

      const citiesPromises = countries.map((country) =>
        axios
          .get(`/api/v1/events/countries/${country.id}/cities`)
          .then((response) =>
            response.data.map((city) => ({
              ...city,
              countryId: country.id,
            }))
          )
      );
      const citiesArrays = await Promise.all(citiesPromises);
      const cities = citiesArrays.flat();

      const districtsPromises = cities.map((city) =>
        axios
          .get(`/api/v1/events/cities/${city.id}/districts`)
          .then((response) =>
            response.data.map((district) => ({
              ...district,
              cityId: city.id,
            }))
          )
      );
      const districtsArrays = await Promise.all(districtsPromises);
      const districts = districtsArrays.flat();

      setLocationData({
        countries,
        cities,
        districts,
      });
    } catch (err) {
      console.error("Error fetching location data:", err);
      setError(err.message || "Error loading location data");
    }
  };

  const filteredCities = React.useMemo(() => {
    if (!selectedCountry) return [];
    return locationData.cities.filter(
      (city) => city.countryId === selectedCountry
    );
  }, [selectedCountry, locationData.cities]);

  const filteredDistricts = React.useMemo(() => {
    if (selectedCities.length === 0) return [];
    return locationData.districts.filter((district) =>
      selectedCities.includes(district.cityId)
    );
  }, [selectedCities, locationData.districts]);

  const handleCountryChange = (event) => {
    const countryId = event.target.value;
    if (countryId === selectedCountry) return;

    setSelectedCountry(countryId);
    setSelectedCities([]);
    setSelectedDistricts([]);
  };

  const handleCityChange = (event) => {
    const cityIds = event.target.value;
    if (cityIds === selectedCities) return;

    setSelectedCities(cityIds);
    setSelectedDistricts([]);
  };

  const handleDistrictChange = (event) => {
    const districtIds = event.target.value;
    if (districtIds === selectedDistricts) return;
    setSelectedDistricts(districtIds);
  };

  const handleDateChange = (date) => {
    if (date != null) {
      const today = dayjs();
      if (date.isBefore(today, "day") || date === fromDate) return;
      setFromDate(date);
    } else {
      setFromDate(dayjs());
    }
  };

  const handleScroll = React.useCallback(() => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      if (loadingMore || errorMore) return;

      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const totalContentHeight = document.documentElement.scrollHeight;

      if (
        scrollPosition >= totalContentHeight - 300 &&
        pageNumber <= totalPages
      ) {
        fetchEvents(false);
      }
    }, 100);
  }, [loadingMore, errorMore, pageNumber, totalPages, fetchEvents]);

  // Initialize data and set up scroll listener
  React.useEffect(() => {
    const initialize = async () => {
      await fetchAllLocationData();
    };

    initialize();
  }, []); // Only run once on mount

  // Separate useEffect for scroll listener
  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll]); // Depend only on handleScroll

  return (
    <Grid container rowSpacing={4} columnSpacing={2.5} sx={{ pt: 3, pb: 5, pl: 12, pr: 12 }} justifyContent="center" alignItems="center">
      <LoadingErrorDisplay
        loading={loading}
        error={error}
        loadingMore={loadingMore}
        errorMore={errorMore}
      />
      <Grid
        item
        size={12}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", mb: 2 }}
      >
        <FormControl sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="country-select-label">Country</InputLabel>
          <Select
            labelId="country-select-label"
            id="country-select"
            value={selectedCountry}
            label="Country"
            onChange={handleCountryChange}
          >
            {locationData.countries.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ m: 1, minWidth: 180 }} disabled={!selectedCountry}>
          <InputLabel id="city-select-label">City</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            multiple
            value={selectedCities}
            label="City"
            renderValue={(selected) => (
              <Stack direction="row" spacing={1}>
                {selected.map((id) => {
                  const city = filteredCities.find((c) => c.id === id);
                  return city ? <Chip key={id} label={city.name} /> : null;
                })}
              </Stack>
            )}
            onChange={handleCityChange}
          >
            {filteredCities.map((city) => (
              <MenuItem key={city.id} value={city.id}>
                {city.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          sx={{ m: 1, minWidth: 180 }}
          disabled={selectedCities.length === 0}
        >
          <InputLabel id="district-select-label">District</InputLabel>
          <Select
            labelId="district-select-label"
            id="district-select"
            multiple
            value={selectedDistricts}
            label="District"
            renderValue={(selected) => (
              <Stack direction="row" spacing={1}>
                {selected.map((id) => {
                  const district = filteredDistricts.find((d) => d.id === id);
                  return district ? (
                    <Chip key={id} label={district.name} />
                  ) : null;
                })}
              </Stack>
            )}
            onChange={handleDistrictChange}
          >
            {filteredDistricts.map((district) => (
              <MenuItem key={district.id} value={district.id}>
                {district.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          locale={dayjs.locale("en")}
        >
          <Stack direction="row" spacing={2}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={handleDateChange}
              minDate={dayjs()}
            />
          </Stack>
        </LocalizationProvider>
      </Grid>

      {events.map((event, index) => (
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6} key={index} display="flex" justifyContent="center" alignItems="center" sx={{ maxWidth: { xs: 500, sm: 500, md: 600, lg: 490, xl: 630 } }}>
          <EventMini event={event} />
        </Grid>
      ))}
    </Grid>
  );
}
