// Function to populate the dropdown with wells and attach event listener
function populateDropdown(wells) {
    const dropdown = document.getElementById('wellDropdown');
    wells.forEach((well) => {
        const option = document.createElement('option');
        option.value = well;
        option.textContent = well;
        dropdown.appendChild(option);
    });

    // When a well is selected, update the plot
    dropdown.addEventListener('change', function () {
        const selectedWell = this.value;
        updatePlot(selectedWell);
    });
}

// Function to update the Plotly graph
function updatePlot(selectedWell) {
    // Filter data for the selected well
    const wellData = window.csvData.filter(row => row.WELL === selectedWell);

    const customTooltip = wellData.map(row => {
        return `Date: ${row['MONTH']}<br>` +
               `Oil Rate: ${row['OIL_RATE(KLPD)']} KLPD<br>` +
               `Water Rate: ${row['WATER_RATE(KLPD)']} KLPD<br>` +
               `Gas Rate: ${row['GAS_RATE(mscum d)']} MSCUM/D`;
    });

    // Transform data into a format suitable for Plotly
    const trace1 = {
        x: wellData.map(row => row['MONTH']),
        y: wellData.map(row => row['OIL_RATE(KLPD)']),
        type: 'scatter',
        name: 'Oil Rate',
        line: {
            color: 'red', // Set the color for the oil trace to red
            shape: 'spline', // Use a spline curve for smoothing
        },
        text: customTooltip, // Add custom tooltip
        hoverinfo: 'text' 
    };
    const trace2 = {
        x: wellData.map(row => row['MONTH']),
        y: wellData.map(row => row['GAS_RATE(mscum d)']),
        type: 'scatter',
        name: 'Gas Rate',
        yaxis: 'y2',
        line: {
            color: 'green', // Set the color for the gas trace to green
            shape: 'spline', // Use a spline curve for smoothing
        },
        text: customTooltip, // Add custom tooltip
        hoverinfo: 'text' 
    };
    const trace3 = {
        x: wellData.map(row => row['MONTH']),
        y: wellData.map(row => row['WATER_RATE(KLPD)']),
        type: 'scatter',
        name: 'Water Rate',
        line: {
            color: 'blue', // Set the color for the water trace to blue
            shape: 'spline', // Use a spline curve for smoothing
        },
        text: customTooltip, // Add custom tooltip
        hoverinfo: 'text' 
    };

    const layout = {
        title: 'Production Rates for ' + selectedWell,
        yaxis: {
            title: 'Liquid Rate (KLPD)',
            showgrid: false, // Remove grid lines on the y-axis
            showline: true,  // Show the y-axis line
        },
        yaxis2: {
            title: 'Gas Rate (MSCUM/D)',
            overlaying: 'y',
            side: 'right',
            showgrid: false, // Remove grid lines on the y2-axis
            showline: true,  // Show the y2-axis line
        },
        xaxis: {
            title: 'Year/Month',
            showgrid: false,
            showline: false,
            rangeslider: {range: [wellData[0]['MONTH'], wellData[wellData.length - 1]['MONTH']], range:{visible: false}, thickness: 0.04},
            type: 'date'
        },
        height: 850,
        hovermode: 'closest',
        
    };

    Plotly.newPlot('wellDataPlot', [trace1, trace2, trace3], layout);
}

window.addEventListener('load', function () {
    // Read the CSV file using PapaParse
    Papa.parse('Dynamic_data_06_10.csv', {
        download: true,
        header: true,
        complete: function (results) {
            window.csvData = results.data;
            const wells = [...new Set(results.data.map(row => row.WELL))];
            populateDropdown(wells);
            updatePlot(wells[0]); // Initialize the plot with the first well

        }
    });
    
});