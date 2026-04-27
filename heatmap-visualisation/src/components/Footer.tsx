import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-bottom">
            <span>Urban Accessibility Analysis</span>
            <span>CM3203 One Semester Individual Project</span>
            <span>Cardiff University</span>
        </p>

      </div>

      <p className="footer-bottom">
        © {new Date().getFullYear()} Heledd Jubb.
      </p>
    </footer>
  );
}