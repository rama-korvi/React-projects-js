import { useEffect, useState } from "react";

function OTTPlatformDetails(props) {

    const API_KEY = 'XXXXXXXXXXXX';

    function getWatchModeRes1() {
        const cached = {};
        //localStorage.setItem()
        return async function (name) {
            if (cached[name]) {
                return cached[name];
            } else {
                const searchUrl = `https://api.watchmode.com/v1/search/?apiKey=${API_KEY}&search_field=name&search_value=${name}`;
                const response = await fetch(searchUrl);
                const data = await response.json();
                cached[name] = data.title_results;
                return data.title_results;
            }
        }
    }
    async function getWatchModeRes(name) {
        const ottDetails = localStorage.getItem(name);
        if (ottDetails === null) {
            const searchUrl = `https://api.watchmode.com/v1/search/?apiKey=${API_KEY}&search_field=name&search_value=${name}`;
            const response = await fetch(searchUrl);
            const data = await response.json();
            localStorage.setItem(name, JSON.stringify(data.title_results));
            return data.title_results;
        } else {
            return JSON.parse(ottDetails);
        }
    }

    const [ottDetails, setOttDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc"
      });
    useEffect(() => {
        let name = props.name
        async function fetchData() {
            //const fetchWatchModes = getWatchModeRes(name);
            const apiResponse = await getWatchModeRes(name);
            setOttDetails(apiResponse);
            setLoading(false);
        }
        fetchData();
        console.log("defaults values are " + JSON.stringify(ottDetails));
    }, []);

    function handleSort(e) {
        const colName = e.currentTarget.dataset.key;
      
        let direction = "asc";
      
        // toggle direction if same column is clicked again
        if (sortConfig.key === colName && sortConfig.direction === "asc") {
          direction = "desc";
        }
      
        const sorted = [...ottDetails].sort((a, b) => {
          if (a[colName] === b[colName]) return 0;
      
          // numeric sort
          if (typeof a[colName] === "number") {
            return direction === "asc"
              ? a[colName] - b[colName]
              : b[colName] - a[colName];
          }
      
          // string sort
          return direction === "asc"
            ? a[colName] > b[colName] ? 1 : -1
            : a[colName] > b[colName] ? -1 : 1;
        });
      
        setOttDetails(sorted);
        setSortConfig({ key: colName, direction });
      }
    function handleMultiSort() {

    }

    return (
        <>
            <h1 className="display-4">{props.name} show details</h1>
            {loading ? (
                <h1 style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh"
                }} className="display-1">Loading {props.name} shows...</h1>
            ) : (
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th data-key="id" onClick={handleSort}>Id</th>
                            <th data-key="name" onClick={handleSort}>Name</th>
                            <th data-key="year" onClick={handleSort}>Year</th>
                            <th data-key="type" onClick={handleSort}>Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ottDetails.map((item) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.year}</td>
                                <td>{item.type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </>
    );
}

export default OTTPlatformDetails;
