import React, { memo } from 'react'

import supportedLanguages from './common'

function LanguagePicker(props) {
    
    var showOptions = function () {
        const options = supportedLanguages.map((lang) => {

            return <option value={lang.id} key={lang.id}>{lang.name}</option>;
        })
        return <> {options} </>
    }
    return (
        <select className="language-picker" value={supportedLanguages.find(x => x.name === props.value).id || 19} onChange={(e) => {
            props.onLanguageChange(e.target.value)
        }}>
            {showOptions()}

        </select>
    )
}

export default memo(LanguagePicker)
