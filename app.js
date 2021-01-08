function init() {
    // creating a variable to use dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // Use the D3 library to read in samples.json to fill menu with "names"
    d3.json("samples.json").then((data) => {
        console.log(data);
        var names = data.names;
       data =  fetch("samples.json")

        names.forEach((sample) => {
            dropdownMenu.append("option")
                .text(sample)
                .property("value", sample);    
        });
        
        var InitialDisplay = names[0];
        build_barchart(InitialDisplay);
        build_bubble(InitialDisplay);
        build_meta(InitialDisplay);
    });
}

function optionChanged(new_name) {
    //building charts when dropdown menu is changed
    build_barchart(new_name);
    build_bubble(new_name);
    build_meta(new_name);
}

function build_barchart(sample) {
    d3.json("samples.json").then((data) => {
        console.log(data);
        // pull one object from JSON for dropdown selected "name"
        var samples = data.samples;
        var tinyJSON = samples.filter(sampleID => sampleID.id == sample);
        var object = tinyJSON[0];

        // create variables to hold data from object
        var otu_ids = object.otu_ids;
        var otu_labels = object.otu_labels;
        var sample_values = object.sample_values;

        // create variable for the bar chart data and layout
        var BAR_layout = {
            title: "Top 10 Bacterial Cultures in the Belly Button Biodiversity",
            margin: {t: 40, l: 140}
        };

        // .splice() => cut out data and .reverse() => order the data from biggest to smallest number
        var BAR_trace1 = [
            {
                y: otu_ids.splice(0, 10).map(otuID => `OTU ID: ${otuID}`).reverse(),
                x: sample_values.splice(0, 10).reverse(), //reverse to match correctly
                text: otu_labels.splice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        // build a bar chart
        Plotly.newPlot("bar", BAR_trace1, BAR_layout);
    }); 
} 

function build_bubble(sample) {
    d3.json("samples.json").then((data) => {
        console.log(data);
        // pull one object from JSON for dropdown selected "name"
        var samples = data.samples;
        var tinyJSON = samples.filter(sampleID => sampleID.id == sample);
        var object = tinyJSON[0];

        // create variables to hold data from object
        var otu_ids = object.otu_ids;
        var otu_labels = object.otu_labels;
        var sample_values = object.sample_values;

        // create variable for the bar chart data and layout
        var bubble_layout = {
            title: "OTUs Occurance",
            showlegend: false,
            height: 500,
            width: 1200
        };

        // bubble chart layout
        
        var bubble_trace1 = [
            {
                y: sample_values,
                x: otu_ids,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    color: otu_ids,
                    size: sample_values
                }
            }
        ];
        // build bar chart
        Plotly.newPlot("bubble", bubble_trace1, bubble_layout);

    });
}

function build_meta(sample) {
    d3.json("samples.json").then((data) => {
        // pull one object from JSON for dropdown selected "name"
        var metadata = data.metadata;
        var tinyJSON2 = metadata.filter(sampleID => sampleID.id == sample);
        var object2 = tinyJSON2[0];

        // metadata display area selection
        var Display = d3.select("#sample-metadata");

        // clear display area
        Display.html("");

        // use Object.entries to add each key:value pair and append a new "row" to the display
        Object.entries(object2).forEach(([key, value]) => {
            Display.append("p").text(`${key}:${value}`);
        });
    }); 
} 


init()