/* eslint-disable */
"use client";
import { axisBottom, axisLeft } from "d3-axis";
import { csv } from "d3-fetch";
import { scaleBand, scaleLinear, scaleOrdinal } from "d3-scale";
import { select } from "d3-selection";
import { useEffect, useRef, useState } from "react";

// Example data: Only the first three rows are provided as an example
// Add more animals or change up the style as you desire

type Diet = "Carnivore" | "Herbivore" | "Omnivore";

// Write this interface
interface AnimalDatum {
  name: string;
  averageSpeed: number;
  diet: Diet;
}

export default function AnimalSpeedGraph() {
  // useRef creates a reference to the div where D3 will draw the chart.
  // https://react.dev/reference/react/useRef
  const graphRef = useRef<HTMLDivElement>(null);

  const [animalData, setAnimalData] = useState<AnimalDatum[]>([]);

  // Load CSV data
  useEffect(() => {
    console.log("Implement CSV loading!");
    csv("/sample_animals.csv")
      .then((rows) => {
        const data = rows.map((row) => ({
          name: row.Animal ?? "Unknown",
          averageSpeed: Number(row["Average Speed (km/h)"]),
          diet: row.Diet as Diet,
        }));

        console.log("animalData:", data);
        setAnimalData(data);
      })
      .catch((error) => console.error("Failed to load animal data:", error));
    // csv("/sample_animals.csv", () => setAnimalData);
  }, []);

  useEffect(() => {
    // Clear any previous SVG to avoid duplicates when React hot-reloads
    if (graphRef.current) {
      graphRef.current.innerHTML = "";
    }

    if (animalData.length === 0) return;

    // Set up chart dimensions and margins
    const containerWidth = graphRef.current?.clientWidth ?? 800;
    const containerHeight = graphRef.current?.clientHeight ?? 500;

    // Set up chart dimensions and margins
    const width = Math.max(containerWidth, 600); // Minimum width of 600px
    const height = Math.max(containerHeight, 420); // Minimum height of 400px
    const margin = { top: 70, right: 60, bottom: 160, left: 100 };

    // Create the SVG element where D3 will draw the chart
    // https://github.com/d3/d3-selection
    const svg = select(graphRef.current!).append<SVGSVGElement>("svg").attr("width", width).attr("height", height);

    // Implement the rest of the graph
    // HINT: Look up the documentation at these links
    // https://github.com/d3/d3-scale#band-scales
    // https://github.com/d3/d3-scale#linear-scales
    // https://github.com/d3/d3-scale#ordinal-scales
    // https://github.com/d3/d3-axis

    // const displayAnimals = ["Cheetah", "Pronghorn", "Brown Bear"];
    const displayAnimals = animalData.slice(0, 20).map((animal) => animal.name);
    const displayedData = animalData.filter((animal) => displayAnimals.includes(animal.name));
    const maxSpeed = Math.max(...displayedData.map((animal) => animal.averageSpeed));

    const x = scaleBand(displayAnimals, [margin.left, width - margin.right]);
    const y = scaleLinear([0, maxSpeed], [height - margin.bottom, margin.top]);
    const color = scaleOrdinal(["Carnivore", "Herbivore", "Omnivore"], ["Salmon", "MediumSpringGreen", "Gold"]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    svg.append("g").attr("transform", `translate(${margin.left},0)`).call(axisLeft(y));

    svg
      .selectAll("rect")
      .data(displayedData)
      .enter()
      .append("rect")
      .attr("x", (data) => x(data.name) ?? 0)
      .attr("y", (data) => y(data.averageSpeed))
      .attr("width", x.bandwidth() / 1.5)
      .attr("height", (data) => y(0) - y(data.averageSpeed))
      .attr("fill", (data) => color(data.diet))
      .attr("transform", `translate(${x.bandwidth() / (1.5 * 4)}, 0)`);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - margin.bottom / 2)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Animal");

    svg
      .append("text")
      .attr("x", -height / 2)
      .attr("y", margin.left / 4)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Speed (km/h)");
  }, [animalData]);

  // Return the graph
  return <div ref={graphRef}></div>;
}
