import { useRef,useEffect,useState } from "react"
import { useProjectStore } from "../store/useProjectStore"
import Masonry from 'react-masonry-css'
import Card from "../components/Card"



const ExplorePage = () => {
    const {getProjects,projects,isLoadingProjects,hasMoreProjects,searchFilter}=useProjectStore();
    const [page, setPage] = useState(1);
    const limit = 2;
    const skip=projects?.length;
    const observerRef = useRef(null);

    
    useEffect(() => {
        getProjects(limit,skip);
    }, [page]);

    useEffect(()=>{
      setPage(1);
    },[searchFilter])

    // console.log(projects)


    useEffect(() => {
    if (!hasMoreProjects || !observerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingProjects && hasMoreProjects) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.2 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMoreProjects, isLoadingProjects,projects]);

  const breakpointColumnsObj = {
    default: 2,
    768: 1,
    480: 1,
  }


  return (
     <div className="min-h-screen pt-7 container mx-auto flex flex-col max-w-5xl p-10">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >

        {projects.map((project) => (
            <Card key={project._id} project={project}/> 
  
        ))}
        
      </Masonry>
      {isLoadingProjects && <p className="text-center mt-4">Loading...</p>}
      {!hasMoreProjects && <p className="text-center mt-4">No more projects to load.</p>}
      <div ref={observerRef} className="h-10"></div>
    </div>
  )
}

export default ExplorePage