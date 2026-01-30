import { Link } from "react-scroll";

export default function Header() {
  return (
    <header
      style={{
        padding: "10px 20px",
        backgroundColor: "#f8f8f8",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link
        to="home"
        smooth={true}
        duration={500}
        style={{
          textDecoration: "none",
          color: "#333",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Home
      </Link>
      <Link
        to="location"
        smooth={true}
        duration={500}
        style={{
          textDecoration: "none",
          color: "#333",
          fontWeight: "bold",
          cursor: "pointer",
          marginLeft: "20px",
        }}
      >
        Localização
      </Link>
      <Link
        to="rsvp"
        smooth={true}
        duration={500}
        style={{
          textDecoration: "none",
          color: "#333",
          fontWeight: "bold",
          cursor: "pointer",
          marginLeft: "20px",
        }}
      >
        Confirme sua presença
      </Link>
    </header>
  );
}
