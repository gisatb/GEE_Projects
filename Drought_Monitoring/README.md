# 🌵 MODIS VCI-Based Drought Mapping Dashboard

Validate and visualize drought conditions using the **Vegetation Condition Index (VCI)** from MODIS NDVI data.

---

## 📌 Project Overview

This project uses **Google Earth Engine (GEE)** to monitor drought conditions by calculating the **Vegetation Condition Index (VCI)**. VCI standardizes vegetation health over time and helps identify stressed areas due to drought. The script produces:

- Drought severity maps  
- Temporal VCI trends  
- Histograms of vegetation conditions  
- Area calculations for each drought category  
- Exports to Google Drive for further analysis  

---

🌐 **Demo**: 

Here’s the dashboard in action 👇  
![crop classification Demo](drought.png)
![crop classification Demo](ee-chart.png)
![crop classification Demo](hist_vci.png)

 ---
 
## 🛰️ Data Used

- **MODIS NDVI:** `MODIS/061/MOD13A2` (16-day composite, 2001–2024)  
- **GAUL 2015:** Country boundaries for defining ROI  

---

## 🛠️ Tech Stack

- **Google Earth Engine (JavaScript API)**  
- **MODIS NDVI Data**  
- **VCI (Vegetation Condition Index) Computation**  
- **Exporting Results:** Google Drive  
- **Visualization:** GEE Map layers, histograms, charts  

---

## 📊 Features & Workflow

### VCI Calculation

\[
\text{VCI} = \frac{\text{NDVI} - \text{NDVI}_{min}}{\text{NDVI}_{max} - \text{NDVI}_{min}} \times 100
\]

### Drought Classification

| Class         | VCI Range |
|---------------|-----------|
| Extreme       | 0–10      |
| Severe        | 10–20     |
| Moderate      | 20–30     |
| Light         | 30–40     |
| No drought    | 40–100    |

### Temporal Mapping

- VCI per image over time  
- Mode of VCI classes for long-term analysis  

### Visualization

- Color-coded drought maps  
- Histograms and charts for VCI distribution  

### Export

- Export classified VCI maps to Google Drive  
- Compute drought areas (km²) per class  

---

## 💡 Use Cases

- Regional drought monitoring  
- Crop stress detection and planning  
- Agricultural decision-making  
- Temporal analysis of vegetation health  

---

## 📂 Demo / Outputs

Include a **GIF or screenshot** showing the VCI map and histogram results.  
Example: Add your GIF or static images in a `demo/` folder in your repo.


---

## 📄 License

This project is released under the **MIT License**.  

---

## 👤 Author

**Atul Bhardwaj**  
Remote Sensing & GIS Specialist  
GitHub: [https://github.com/gisatb](https://github.com/gisatb)
