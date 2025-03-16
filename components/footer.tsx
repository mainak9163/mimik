const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
      <footer className="w-full border-t border-border bg-background/80 py-4">
        <div className="container mx-auto flex flex-col justify-between px-4 md:flex-row md:items-center">
          <div className="mb-2 md:mb-0">
            <a 
              href="/contact-us" 
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              Contact Us
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; Copyright {currentYear} p3co inclusive
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;