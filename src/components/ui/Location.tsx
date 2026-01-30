interface LocationProps {
  embedUrl?: string;
  title?: string;
}

export default function Location({
  embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3690.555709079446!2d-42.4949624!3d-22.3326366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x978bf392346977%3A0x18580ad35fc3a315!2sVilla%20Massari!5e0!3m2!1spt-BR!2sbr!4v1769781579878!5m2!1spt-BR!2sbr",
  title = "📍 Villa Massari - Estrada Vereador Eugênio Guilherme Spitz, 2250 - Mury Nova Friburgo",
}: LocationProps) {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>{title}</h2>
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          height: "450px",
          margin: "0 auto",
          border: "2px solid #ddd",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <iframe
          src={embedUrl}
          width="600"
          height="450"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={title}
        />
      </div>
      <a
        href="https://www.google.com/maps/place/Villa+Massari/@-22.3326366,-42.4949624,17z/data=!3m1!4b1!4m6!3m5!1s0x978bf392346977:0x18580ad35fc3a315!8m2!3d-22.3326366!4d-42.4949624!16s%2Fg%2F11l2f99k91"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-block",
          marginTop: "10px",
          padding: "10px 20px",
          backgroundColor: "#4285f4",
          color: "white",
          textDecoration: "none",
          borderRadius: "4px",
          fontWeight: "bold",
        }}
      >
        📍 Abrir no Google Maps
      </a>
    </div>
  );
}
