import {useEffect} from "react";


const useWindowScroll = (props) => {
  const { handleScroll, element } = props

  let currentEl = element.current

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);


    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll, currentEl])
}

export default useWindowScroll
