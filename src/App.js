import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import DragHandleIcon from '@material-ui/icons/DragHandle';
import {nanoid} from 'nanoid';

const App = props => {
    const [format, setFormat] = useState("word = reading (type): definition");
    const [options, setOptions] = useState([]);
    const [cards, setCards] = useState([]);


    const getTermAndDef = card => {
        const result = parseFormat();
        const term = result['term'];
        const def = result['def'];

        let termStr = "";
        let index = 0;
        for(let i  = 0; i < term.keywords.length; i++) {
            termStr += term.str.substring(index, term.keywords[i].index) + card[term.keywords[i].keyword];
            index = term.keywords[i].index;
        }
        termStr += term.str.substring(index);

        let defStr = "";
        index = 0;
        for(let i  = 0; i < def.keywords.length; i++) {
            defStr += def.str.substring(index, def.keywords[i].index) + card[def.keywords[i].keyword];
            index = def.keywords[i].index;
        }
        defStr += def.str.substring(index);
        
        return {
            "term":termStr,
            "def":defStr
        }
    }
    const parseFormat = () => {
        const split = format.indexOf("=");
        const term = format.substring(0, split).trim();
        const termResult = removeKeywords(term);
    
        const definition = format.substring(split + 1).trim();
        const defResult = removeKeywords(definition);
        
        return {
            'term':termResult,
            'def':defResult
        }
    }
    const removeKeywords = str => {
        let result = [];
        let newStr = str;
        let cur = getFirstKeyword(newStr);
        let count = 0;
        while(cur.index != -1  && count < 10) {
            result.push(cur);
            newStr = removeFirstOccurrence(newStr, cur.keyword);
            cur = getFirstKeyword(newStr);
            count++;
        }
        return {
            "str":newStr,
            "keywords":result
        };
    }
    const getFirstKeyword = str => {
        const keywords = ["word", "definition", "type", "reading", "transitivity", "auxiliary"];
        let min = {
            "index":-1,
            "keyword":undefined
        };
        for(let i = 0; i < keywords.length; i++) {
            if(str.includes(keywords[i])) {
                if(min.index == -1 || str.indexOf(keywords[i]) < min.index) {
                    min.index = str.indexOf(keywords[i]);
                    min.keyword = keywords[i];
                }
            }
        }
        return min;
    }
    const removeFirstOccurrence = (str, searchstr) => {
        var index = str.indexOf(searchstr);
        if (index === -1) return str;
        return str.slice(0, index) + str.slice(index + searchstr.length);
    }
    


    const handleSearch = () => {
        const query = document.getElementById("searchInp").value;
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = () => {
            if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                const data = JSON.parse(xmlhttp.responseText).data;
                let newOptions = [];
                for(let i = 0; i < data.length; i++) {
                    const cur = data[i];
                    const reading = cur.japanese[0].reading;
                    const word = cur.japanese[0].word !== undefined ? cur.japanese[0].word : cur.japanese[0].reading;
                    let senses = [];
                    let parts = [];
                    for(let j = 0; j < cur.senses.length; j++) {
                        let meaningStr = "";
                        for(let k = 0; k < cur.senses[j].english_definitions.length; k++) {
                            meaningStr += cur.senses[j].english_definitions[k] + ", ";
                        }
                        senses.push(meaningStr.substring(0, meaningStr.length - 2));
                        parts.push(data[i].senses[j].parts_of_speech[0]);
                    }
                    newOptions.push({
                        "reading":reading,
                        "word":word,
                        "senses":senses,
                        "parts":parts
                    });
                }
                console.log(options);
                console.log(newOptions);
                setOptions(newOptions);
            }
        }
        xmlhttp.open("POST", "https://rorygudka.com/React%20Creator/react-creator/public/apiConnect.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`eng=${query}`);
    };
    const handleFormatChange = () => {

    };
    const handleAdd = (e, i, j) => {
        const word = options[i].word;
        const parts = options[i].parts[j];
        let type = "Adverb/Expression";
        let transitivity = "";
        let auxiliary = "";
        for(let k = 0; k < parts.length; k++) {
            const part = parts[k];
            if(part.includes("Noun")) type = "Noun";
            else if(part.includes("Transitive")) transitivity = "Transitive";
            else if(part.includes("Intransitive")) transitivity = "Intransitive";
            else if(part.includes("Ichidan")) type = "Ru Verb";
            else if(part.includes("Godan")) type = "U Verb";
            else if(part.includes("Suru")) type = "Suru Verb";
            else if(part.includes("I-adjective")) type = "い Adjective";
            else if(part.includes("Na-adjective")) type = "な Adjective";
            else if(part.includes("Auxiliary")) auxiliary = "Auxiliary";
            else if(part.includes("verb")) type ="Verb";
        }
        const keys = {
            "word":word,
            "reading":options[i].reading,
            "type":type,
            "transitivity":transitivity,
            "auxiliary":auxiliary,
            "definition":options[i].senses
        }

        const results = getTermAndDef(keys);
        setCards([...cards, {...keys, ...results}]);
    }



    let senseCount = 0;
    const mapSenses = (sense, index) => {
        let j = senseCount++;
        return (
            <div key={nanoid()} className="meaning">
                <p className="meaningP">{sense}</p>
                <Button classes={{root:"addRoot"}} data-j={senseCount} variant="outlined" color="primary" className="add" onClick={e => handleAdd(e, index, j)}>Add</Button>
            </div>
        );
    };
    let sensesList = [];
    for(let i = 0; i < options.length; i++) {
        senseCount = 0;
        sensesList.push(options[i].senses.map(sense => mapSenses(sense, i)));
    }
    let counter = 0;
    const optionsList = options.map(option => (
        <Grid item key={nanoid()}>
            <Paper className="word" elevation={3}>
                <div className="japanese">
                    <div className="basic">
                        <p>{option.reading}</p>
                    </div>
                    <div className="advanced">
                        <p>{option.word}</p>
                    </div>
                </div>
                <div className="senses">
                    {sensesList[counter++]}
                </div>
            </Paper>
        </Grid>
    ));
    const cardsList = cards.map(card => (
        <Paper key={nanoid()} dataset={{"index":card.id}} className="card" elevation={3}>
            <div className="dots">
                <DragHandleIcon className="dragHandle" />
            </div>
            <div className="cardTerm">
                <p><b>{card.term}</b></p>
            </div>
            <div className="cardDef">
                <p>{card.definition}</p>
            </div>
        </Paper>
    ));
    return ( 
        <div id="App">
            <div id="searchWrap">
                <div id="searchTxtWrap">
                    <TextField fullWidth id="searchInp" placeholder="English, Japanese, or Romaji" />
                </div>
                <Button variant="contained" color="primary" id="searchBtn" onClick={handleSearch}>Search</Button>
            </div>
            <div id="container"></div>
            <div id="formatWrap">
                <TextField fullWidth id="formatInp" value={format} onChange={() => handleFormatChange} />
            </div>
            <div id="cards">
                <Grid container justify="center">
                    {optionsList.length === 0 ? "Add cards to your list" : optionsList}
                </Grid>
            </div>
            <div id="cards">
                {cardsList}
            </div>
        </div>
    );
}

export default App;