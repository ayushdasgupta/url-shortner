const LoadingSpinner = ({ size = 'medium' }) => {
    let sizeClass = 'h-8 w-8';
    
    if (size === 'small') {
      sizeClass = 'h-5 w-5';
    } else if (size === 'large') {
      sizeClass = 'h-12 w-12';
    }
    
    return (
      <div className="flex justify-center items-center">
        <div className={`${sizeClass} border-t-2 border-b-2 border-primary-500 rounded-full animate-spin`}></div>
      </div>
    );
  };
  
  export default LoadingSpinner;