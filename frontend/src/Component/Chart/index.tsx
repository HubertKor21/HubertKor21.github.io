import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import api from "../../api";

const ChartComponent = () => {
  const [dates, setDates] = useState<string[]>([]);
  const [salesData, setSalesData] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/group-balance-chart/"); // Przykładowe API
        const { dates, expenses } = response.data; // Przykład danych z API

        // Zliczanie wydatków dla każdej daty
        const expensesByDate = dates.reduce((acc, date, index) => {
          // Zaczynamy od 0, a potem dodajemy wydatki dla tej samej daty
          acc[date] = (acc[date] || 0) + expenses[index];
          return acc;
        }, {});

        // Tworzymy nowe tablice z posortowanymi danymi (daty i zliczone wydatki)
        const sortedDates = Object.keys(expensesByDate).sort();
        const sortedExpenses = sortedDates.map(date => expensesByDate[date]);

        // Ustawiamy posortowane dane do stanu
        setDates(sortedDates);
        setSalesData(sortedExpenses);

        console.log("Zliczone dane:", expensesByDate);
        console.log("Posortowane daty:", sortedDates);
        console.log("Zliczone wydatki:", sortedExpenses);
      } catch (error) {
        console.error("Błąd podczas pobierania danych", error);
      }
    };

    fetchData();
  }, []);

  const options = {
	chart: {
		type: "area",
	  },
    xaxis: {
      type: "datetime", // Określenie, że to kategorie
	  categories: dates.map((date) => new Date(date).getTime()), // Przekształć daty na timestamp
    },
  };

  const series = [
    {
      name: "expenses",
      data: salesData,
    },
	
  ];

  return (
    <div className="w-full bg-white shadow-sm rounded-xl py-4 px-3">
      <Chart
        options={options}
        series={series}
        type="area"
        height={350}
      />
    </div>
  );
};

export default ChartComponent;
