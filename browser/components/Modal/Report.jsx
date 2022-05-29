import { useState } from 'react';

export default function Report() {
    const [reportId, setReportId] = useState(0)

    return (
        <div className="noselect" style={{width: 450}}>
            {(reportId==0)?
                <div>
                    <h1 style={{textAlign: 'center', marginBottom: 25}}>Report</h1>
                    <h2 onClick={() => setReportId(10)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Hate speech
                    </h2>
                    <h2 onClick={() => setReportId(20)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Intellectual Property Infringement
                    </h2>
                    <h2 onClick={() => setReportId(30)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Nudity
                    </h2>
                    <h2 onClick={() => setReportId(40)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Spam & Fake
                    </h2>
                    <h2 onClick={() => setReportId(50)} style={{padding: '25px', cursor: 'pointer'}}>
                        Violence
                    </h2>
                </div>
            :reportId == 10?
                <div>
                    <h1 style={{textAlign: 'center', marginBottom: 25}}>Report</h1>
                    <h2 onClick={() => setReportId(11)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Hate speech
                    </h2>
                    <h2 onClick={() => setReportId(12)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Intellectual Property Infringement
                    </h2>
                    <h2 onClick={() => setReportId(13)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Nudity
                    </h2>
                    <h2 onClick={() => setReportId(14)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Spam & Fake
                    </h2>
                    <h2 onClick={() => setReportId(15)} style={{padding: '25px', cursor: 'pointer'}}>
                        Violence
                    </h2>
                </div>
            :reportId == 20?
                <div>
                    <h1 style={{textAlign: 'center', marginBottom: 25}}>Report</h1>
                    <h2 onClick={() => setReportId(10)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Hate speech
                    </h2>
                    <h2 onClick={() => setReportId(20)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Intellectual Property Infringement
                    </h2>
                    <h2 onClick={() => setReportId(30)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Nudity
                    </h2>
                    <h2 onClick={() => setReportId(40)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Spam & Fake
                    </h2>
                    <h2 onClick={() => setReportId(50)} style={{padding: '25px', cursor: 'pointer'}}>
                        Violence
                    </h2>
                </div>
            :reportId == 30?
                <div>
                    <h1 style={{textAlign: 'center', marginBottom: 25}}>Report</h1>
                    <h2 onClick={() => setReportId(10)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Hate speech
                    </h2>
                    <h2 onClick={() => setReportId(20)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Intellectual Property Infringement
                    </h2>
                    <h2 onClick={() => setReportId(30)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Nudity
                    </h2>
                    <h2 onClick={() => setReportId(40)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Spam & Fake
                    </h2>
                    <h2 onClick={() => setReportId(50)} style={{padding: '25px', cursor: 'pointer'}}>
                        Violence
                    </h2>
                </div>
            :reportId == 50?
                <div>
                    <h1 style={{textAlign: 'center', marginBottom: 25}}>Report</h1>
                    <h2 onClick={() => setReportId(10)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Hate speech
                    </h2>
                    <h2 onClick={() => setReportId(20)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Intellectual Property Infringement
                    </h2>
                    <h2 onClick={() => setReportId(30)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Nudity
                    </h2>
                    <h2 onClick={() => setReportId(40)} style={{padding: '25px', cursor: 'pointer', borderBottom: '1px solid var(--grey)'}}>
                        Spam & Fake
                    </h2>
                    <h2 onClick={() => setReportId(50)} style={{padding: '25px', cursor: 'pointer'}}>
                        Violence
                    </h2>
                </div>
            :null}
        </div>
    )
}