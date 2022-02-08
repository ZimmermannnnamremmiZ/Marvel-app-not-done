import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive'

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton'
import useMarvelService from '../../services/MarvelService';

import './charInfo.scss';

const  CharInfo = (props) => {

    const [character, setCharacter] = useState(null)
    const [display, setDisplay] = useState()

    const {loading, error, getCharacter, clearError} = useMarvelService();
    const maxW1090px = useMediaQuery({ query: '(max-width: 1090px)' })

    useEffect(() => {
        const updateCharacter = () => {
            if (!props.characterId) {
                return;
            };
            clearError();
            getCharacter(props.characterId)
                .then(onCharacterLoaded)
                .then(setDisplay({display: "block"}))
        }
    updateCharacter()
    }, [props.characterId])

    const onCharacterLoaded = (character) => {
        setCharacter(character)
    }

    const onClose = () => {
        setDisplay({display: "none"})
        console.log('close')
    }

        const skeleton = character || maxW1090px || loading || error ? null : <Skeleton />;
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error || !character) ? <View onClose={onClose} character={character}/> : null;

        return (
            <div className="char__info" style={display}>
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
}

const View = (props) => {
    const {name, description, thumbnail, homepage, wiki, comics} = props.character;
    
    const checkThumbnail = () => {
        return thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ? {objectFit: 'initial'} : {objectFit: 'cover'};
    }

    return (
        <>
            <div className="char__basics">
                <img style={checkThumbnail()} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
                <button onClick={() => props.onClose()} className='char__closeButton'></button>
            </div>
            <div className="char__descr">
               {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {!comics.length ? <ErrorMessage /> : null}
                { comics.map((item, i) => {
                        return  (i < 9) ? (
                            <li className="char__comics-item" key={i}>
                                {item.name}
                            </li>
                        ) : null
                    })
                }
            </ul>
        </>
    )
}

export default CharInfo;