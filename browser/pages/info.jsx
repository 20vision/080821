import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PaperPreview from '../components/User/Carousel/PaperPreview'
const InfoLayout = dynamic(
  () => import("../layouts/info"),
  {ssr : false}
)
import Link from 'next/link'
import indexStyles from '../styles/modal/index.module.css'

export default function Info() {
    const router = useRouter()
    const [selection, setSelection] = useState(router.query.ab=='about'?2:router.query.ab=='terms'?1:0)

    useEffect(() => {
        setSelection(router.query.ab=='about'?2:router.query.ab=='terms'?1:0)
    }, [router.query.ab])
  return (
    <InfoLayout setSelection={setSelection}>
        <div>
            <div className={indexStyles.header} style={{marginBottom: 50, position: 'absolute', right: 'auto', left: 'auto',top:0, backgroundColor: 'var(--black)'}}>
                <div style={{width: 600, display: 'flex'}}>
                    <Link href='/info?ab=privacy'><a><h1 className={selection == 0?indexStyles.highlight:null}>
                        Privacy Policy
                    </h1></a></Link>
                    <Link href='/info?ab=terms'><a><h1 className={selection == 1?indexStyles.highlight:null}>
                        Terms of Service
                    </h1></a></Link>
                    <Link href='/info?ab=about'><a><h1 className={selection == 2?indexStyles.highlight:null}>
                        About
                    </h1></a></Link>
                </div>
            </div>
            {selection==0?<PrivacyPolicy/>:selection==1?<TermsOfService/>:<AboutUs/>}
        </div>
    </InfoLayout>
  )
}

const AboutUs = () => {
    return(
        <div style={{marginTop: 80}}>
            Information according to § 5 ECG und § 14 UGB, § 25 MedienG:
 <br/>
 20Vision GmbH<br/>
 Corporate Register Number: 578589t<br/>
 Company register court: Commercial Court of Vienna<br/>
 <br/>
 email: business@20.vision<br/>
 <br/>
 Business Purpose: Softwaredevelopment<br/>
 <br/>
 UID Number: ATU78179659<br/>
 <br/>
 Member of the WKÖ: <a style={{textDecoration: 'underline' }} href='https://www.wko.at/'>https://www.wko.at/</a>&nbsp;<br/>
 <br/>
 Authority in Charge: magistrate in charge for the 22th district<br/>
 <br/>
Consumers have the right to file complaints to the online complaint system of the EU: <a style={{textDecoration: 'underline' }} href='http://ec.europa.eu/odr'>http://ec.europa.eu/odr</a>&nbsp; They can also file complaints to the email above. There is no disposition for the participation in such proceeds.<br/>
<br/>
 RIS-Gewerbeordnung: RIS - Gewerbeordnung 1994 - Bundesrecht konsolidiert: <a style={{textDecoration: 'underline' }} href='https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10007517'>https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10007517</a>&nbsp;<br/>
        </div>
    )
}

const TermsOfService = () => {
    return(
        <div style={{marginTop: 80}}>
            <div>
        <strong id="1">
          <ol>
            <li dir="ltr">
              <p dir="ltr">
                Preamble
              </p>
            </li>
          </ol>
          <br />
        </strong>
        <p dir="ltr">
          20Vision GmbH, with its registered office at Anisgasse 30, 1220 Vienna,
          (hereinafter referred to as "20Vision"), operates the platform "20Vision"
          (hereinafter referred to as "PLATFORM"). 20VISION offers the PLATFORM to
          private users and users who wish to use the PLATFORM for business purposes
          (hereinafter referred to as "USERS").
        </p>
        <br />
        <p dir="ltr">
          For reasons of better readability, no gender-specific differentiation is
          made. This is done without any intention of discrimination. All genders are
          equally addressed.
        </p>
        <br />
        <ol start={2}>
          <li dir="ltr">
            <p dir="ltr">
              Scope of Application
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          These TERMS OF USE define and regulate the acquisition, use and
          exploitation of the PLATFORM as well as the associated business and
          administrative activities if the USER uses the PLATFORM free of charge.
          However, if the USER wishes to use the PLATFORM for a fee, separate general
          terms and conditions shall apply.
        </p>
        <br />
        <ol start={3}>
          <li dir="ltr">
            <p dir="ltr">
              Usage Requirements
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          The USER is obliged to provide truthful, comprehensive and correct
          information within the framework of the business relationship and to keep
          his specific information up to date at all times. The USER must treat all
          data confidentially (this applies particularly to log-in data and
          passwords). If the USER suspects a misuse of the PLATFORM by third parties,
          he has to inform 20VISION immediately.
        </p>
        <br />
        <p dir="ltr">
          The USER shall refrain from all actions that may endanger or impair the
          technical functionality of the PLATFORM (including cyber attacks). Such
          behaviour will be prosecuted.
        </p>
        <br />
        <p dir="ltr">
          The USER shall take appropriate precautions to protect the PLATFORM from
          unauthorised access by third parties.
        </p>
        <br />
        <p dir="ltr">
          The USER is responsible for setting up the necessary infrastructure to
          ensure the intended operation of the PLATFORM. 20VISION is not obliged to
          provide further information or recommendations in this regard.
        </p>
        <br />
        <ol start={4}>
          <li dir="ltr">
            <p dir="ltr">
              Rules of Conduct
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          The USER undertakes not to post any content on the PLATFORM which, due to
          its content or form or design or in any other way, violates applicable law
          or morality. Particularly, the USER undertakes to observe applicable law
          (e.g. criminal law, competition law and youth protection law) when
          uploading content and not to violate any third party rights (e.g. name,
          trademark, copyright, image and data protection rights) or confidentiality
          obligations.
        </p>
        <br />
        <p dir="ltr">
          In particular, but not exclusively, the USER is not permitted to publish or
          support content that
        </p>
        <br />
        <p dir="ltr">
          - promotes racism
        </p>
        <p dir="ltr">
          - Includes the glorification of violence and extremism of any kind
        </p>
        <p dir="ltr">
          - incitement and solicitation to commit criminal offences and
          misdemeanours, threats against life, limb or property
        </p>
        <p dir="ltr">
          - incitement against persons or companies
        </p>
        <p dir="ltr">
          - statements that violate personal rights, insults, defamation and slander
          to the detriment of users and third parties
        </p>
        <p dir="ltr">
          - offences against the law of honest practices
        </p>
        <p dir="ltr">
          - content that infringes copyright or violates other intellectual property
          rights
        </p>
        <p dir="ltr">
          - promotes sexual harassment of users and third parties
        </p>
        <p dir="ltr">
          - contains offensive, sexist, obscene, vulgar, hateful or profane material
          or language
        </p>
        <p dir="ltr">
          - depicts, concern or contain pornography.
        </p>
        <br />
        <p dir="ltr">
          This also applies if the respective content does not violate applicable
          law, the rights of third parties or morality.
        </p>
        <br />
        <p dir="ltr">
          The “Vision" to be created must not offend anyone or contain threats. The
          “Visions" must comply with the norms and ethics of society.
        </p>
        <br />
        <p dir="ltr">
          It is also a violation of personal rights and, therefore, not permitted to
          remove the anonymity of other USERS or to publish information of other
          USERS from private messages, e-mails or chats that are not intended for the
          public. USERS may not disclose in their posts or otherwise any information
          that could reveal the identity of another user or that the USER has
          received from other users solely in private messages, e-mails or chats.
        </p>
        <br />
        <p dir="ltr">
          Scraping (web scraping, crawling) of information published in the PLATFORM
          is prohibited and requires the express consent of 20VISION.
        </p>
        <br />
        <ol start={5}>
          <li dir="ltr">
            <p dir="ltr">
              Rights of Use
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          20VISION grants the USER the non-exclusive right limited in time, content
          and location to use the PLATFORM for the purpose of participating in
          communication via the PLATFORM. The exclusive right to use and exploit the
          PLATFORM remains with 20VISION in any case.
        </p>
        <br />
        <p dir="ltr">
          The USER is permitted to use the PLATFORM exclusively for the purposes
          intended by 20VISION.
        </p>
        <br />
        <p dir="ltr">
          Sub-licensing or further licensing is only permitted with the express
          consent of 20VISION. Resale of the PLATFORM also requires the express
          consent of 20VISION.
        </p>
        <br />
        <p dir="ltr">
          The right to decompile the PLATFORM is excluded.
        </p>
        <br />
        <p dir="ltr">
          Identifications on the PLATFORM, in particular copyright notices,
          trademarks, serial numbers or similar may not be removed, changed or made
          unrecognisable.
        </p>
        <br />
        <ol start={6}>
          <li dir="ltr">
            <p dir="ltr">
              Right to Publish “Visions”
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          20VISION is entitled to publish the results of "Visions" on an anonymous
          basis, provided that this publication does not conflict with any legitimate
          interests.
        </p>
        <br />
        <p dir="ltr">
          The USER grants 20VISION an irrevocable, non-exclusive, spatially,
          temporally and content-wise unrestricted right transferable to third
          parties to use the posted content free of charge. 20VISION is entitled to
          use, edit and exploit the contents of "Visions" at any time. This includes
          in particular the right to reproduction, the right to distribution and the
          right to public reproduction, in particular the right to public access. The
          USER waives the right to the copyright designation.
        </p>
        <br />
        <p dir="ltr">
          20VISION will not publish any content if legitimate interests of the USER
          are violated.
        </p>
        <br />
        <ol start={7}>
          <li dir="ltr">
            <p dir="ltr">
              Audit Clause
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          20VISION is entitled to audit the license-compliant use of the PLATFORM.
          Irrespective of this, 20VISION may demand proof from the USER that the
          PLATFORM is being used in accordance with the intended purposes. All
          enquiries in connection with the use of the PLATFORM must be answered
          correctly and truthfully.
        </p>
        <br />
        <p dir="ltr">
          20VISION is entitled to verify the intended use of the PLATFORM by the USER
          at any time after a period of at least 14 days and on site (licence audit).
          20VISION may use the assistance of an auditor or lawyer bound to secrecy
          for this purpose. 20VISION will respect business and trade secrets as well
          as data protection interests of the USER as much as possible. The licence
          audit shall be carried out during normal business hours while maintaining
          the business activities of the USER. The costs incurred in this connection
          shall be borne by each party. The USER is obliged to provide 20VISION with
          the information required for these purposes and to cooperate with 20VISION
          within the scope of the licence audit. Otherwise, 20VISION is entitled to
          refuse its services without prejudice to further legal claims.
        </p>
        <br />
        <ol start={8}>
          <li dir="ltr">
            <p dir="ltr">
              Right to Discontinuation
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          Since no paid version is owed, 20VISION is in no way obligated to provide
          the PLATFORM. 20VISION reserves the right to discontinue the PLATFORM
          without prior notice. The release of the source code (with the exception of
          open source components), a user manual, or support is expressly not owed.
        </p>
        <br />
        <ol start={9}>
          <li dir="ltr">
            <p dir="ltr">
              Change Requests
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          The USER has the right to propose changes to the PLATFORM. 20VISION is not
          obligated to comply with these change requests.
        </p>
        <br />
        <ol start={10}>
          <li dir="ltr">
            <p dir="ltr">
              Limitation of Liability and Warranty
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          Since no paid version is owed, all warranty and liability claims against
          20VISION are fully excluded. This does not apply in the case of intentional
          damage.
        </p>
        <br />
        <p dir="ltr">
          Since 20VISION does not change or influence the “Visions", 20VISION is not
          liable for published “Visions" of the USERS.
        </p>
        <br />
        <ol start={11}>
          <li dir="ltr">
            <p dir="ltr">
              Indemnification
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          In case a claim is made against 20VISION by a third party due to the
          illegal use of the PLATFORM by the USER, the USER is obliged to indemnify
          and grant 20VISION indemnity.
        </p>
        <br />
        <ol start={12}>
          <li dir="ltr">
            <p dir="ltr">
              Changes to the Terms of Use
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          20VISION is entitled to change these TERMS OF USE at any time. 20VISION
          will notify the USER of such changes by sending the amended TERMS OF USE to
          the last contact details provided by the USER. The USER has the right to
          object to the changes. If the USER does not object within 14 days of being
          notified of the changes, tacit consent to the amended TERMS OF USE shall be
          assumed. In this way, no deterioration to the detriment of the USER can be
          stipulated.
        </p>
        <br />
        <ol start={13}>
          <li dir="ltr">
            <p dir="ltr">
              Protection of Data, Business- and Trade Secrets
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          The transfer of data and information to a specific business partner is only
          permitted to the extent necessary to fulfil contractual and legal
          obligations and to protect legitimate interests (cf. Art 6 (1) lit b, c and
          lit f DSGVO).
        </p>
        <br />
        <p dir="ltr">
          20VISION points out that data of the USER may be processed for advertising
          purposes on the basis of legitimate interests (Art 6 para 1 lit f DSGVO).
          The USER can object to this form of data processing at any time (Art 21
          para 2 GDPR).
        </p>
        <br />
        <ol start={14}>
          <li dir="ltr">
            <p dir="ltr">
              Denial of Access to the PLATFORM
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          If 20VISION has reasonable grounds to suspect that the USER is using the
          PLATFORM in an illegal or inappropriate manner, 20VISION is entitled to
          block access to the PLATFORM immediately and without prior notice. The
          possibility of further legal steps remains unaffected by such barring.
        </p>
        <br />
        <ol start={15}>
          <li dir="ltr">
            <p dir="ltr">
              Applicable Law and Place of Jurisdiction
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          The contractual relationship is subject to Austrian law and the Austrian
          law is stipulated. However, this choice of law may not result in the USER
          being deprived of the protection granted to him by the mandatory provisions
          of his country of residence (Art 6 para 2 Rome I Regulation). The
          application of the United Nations Convention on Contracts for the
          International Sale of Goods (UN Sales Convention) as well as of reference
          norms is excluded.
        </p>
        <br />
        <p dir="ltr">
          The exclusive place of jurisdiction shall be the respective court in
          Vienna. If the USER is a private customer and has his domicile or habitual
          residence in Austria or is employed in Austria, the USER may only be sued
          before the courts in whose district his domicile, habitual residence or
          place of employment is located.
        </p>
        <br />
        <p dir="ltr">
          The place of performance is the registered office of 20VISION.
        </p>
        <br />
        <p dir="ltr">
          Reference is made to the possibility of dispute resolution via an online
          dispute resolution platform (Art 14 para 1 S 1 ODR Regulation) and national
          consumer arbitrations
          https://ec.europa.eu/consumers/odr/main/?event=main.home2.show 20VISION is
          not willing to participate in a dispute resolution procedure before a
          consumer arbitration.
        </p>
        <br />
        <ol start={16}>
          <li dir="ltr">
            <p dir="ltr">
              Miscellaneous
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          Should individual provisions of these TERMS OF USE be inapplicable or
          invalid, this shall not affect the validity of the remaining provisions.
          The invalid provision shall be replaced by a valid provision which comes as
          close as possible to the intention of both contracting parties as expressed
          in the current TERMS OF USE.
        </p>
        <br />
        <p dir="ltr">
          Additions to these TERMS OF USE as well as extensions and amendments to
          these TERMS OF USE shall only be valid if agreed upon and signed in
          writing.
        </p>
        <br />
        <p dir="ltr">
          20VISION recommends that the USER permanently retains these TERMS OF USE.
        </p>
        <br />
        <br />
        <br />
      </div>
        </div>
    )
}

const PrivacyPolicy = () => {
    return(
        <div style={{marginTop: 80}}>
            <div>
        <ol>
          <li dir="ltr">
            <p dir="ltr">
              What data do we process when you visit our platform?
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          Welcome to our platform! Please get an idea of how we process your personal
          data when you visit our platform (Art 13, Art 14 DSGVO; § 165 Abs 3 TKG).
        </p>
        <br />
        <p dir="ltr">
          When you visit our platform, the following data may be processed:
        </p>
        <br />
        <ul>
          <li dir="ltr">
            <p dir="ltr">
              Type of browser,
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              IP address and pages visited on our platform including entry and
              exit pages,
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              Device data: We may store personal data from your device. Such data
              includes geolocation data, IP address, unique identifiers (e.g. MAC
              address),
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              Input on our platform
            </p>
          </li>
        </ul>
        <br />
        <p dir="ltr">
          Note: In principle, we try to make communication on our platform as
          anonymous as possible. However, we would like to point out that in certain
          cases - such as criminal prosecution - this anonymity cannot be guaranteed.
        </p>
        <br />
        <p dir="ltr">
          The processing of this data is necessary to ensure the security of the
          operation and the functionality of the platform from a technical point of
          view. The collection of this data is partly carried out via technical
          cookies. These technical cookies are only used to the extent necessary (§
          165 para 3 TKG). The processing of this data is justified by our legitimate
          interest in operating our platform (Art 6 para 1 lit f DSGVO).
        </p>
        <br />
        <p dir="ltr">
          For the operation of our platform, it may be necessary for us to disclose
          your data to the following recipients:
        </p>
        <br />
        <ul>
          <li dir="ltr">
            <p dir="ltr">
              Recipient data: Google Cloud (Alphabet Inc)
            </p>
          </li>
          <ul>
            <li dir="ltr">
              <p dir="ltr">
                Purpose of the data processing: Platform hosting
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Legal basis of data processing: Predominantly legitimate
                interest (Art 6 para 1 lit f DSGVO).
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Registered office: USA.
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Basis for transfer to a third country: Standard data protection
                clauses pursuant to Art 46 para 2 lit c DSGVO.
              </p>
            </li>
          </ul>
        </ul>
        <h2 dir="ltr">
          II.1. Overview of the "technical" cookies used
        </h2>
        <br />
        <p dir="ltr">
          The above-mentioned data is stored via so-called "cookies". Cookies are
          text files that are stored on your computer and enable an analysis of the
          use of the website. They are used for the recognition and storage of
          temporary data of the homepage visitor. We only use cookies to the extent
          necessary to communicate with you via the homepage.
        </p>
        <br />
        <p dir="ltr">
          These technical cookies are activated as soon as you visit our platform.
        </p>
        <br />
        <p dir="ltr">
          The following cookies are used on our platform on the basis of our
          predominantly legitimate interest (Art 6 para 1 lit f DSGVO):
        </p>
        <br />
        <p dir="ltr">
          Name of the cookie: “auth_token”
        </p>
        <ul>
          <li dir="ltr">
            <p dir="ltr">
              Purpose of the cookie and functionality: The cookie is used to
              encrypt and decrypt data with the help of a ‘secret’, located on
              the server. In case of inquiries, the token is sent to the server
              to identify the user. To protect people who have lost their device
              or to prevent malicious activity, sessions are stored in the
              database. The token you send contains the 'session_id'. On the
              server you can then check whether the session_id is still valid or
              has already expired.
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              Storage period: Session
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              Location of storage: USA
            </p>
          </li>
        </ul>
        <h2 dir="ltr">
          II.2. Overview of the "advertising cookies" used
        </h2>
        <br />
        <p dir="ltr">
          In addition to the "technical cookies" described above, we also use
          so-called advertising cookies (including "statistical cookies"). These
          advertising cookies enable us to better understand and evaluate your
          interests. With the help of the advertising cookies, we can merge your
          "surfing behaviour" beyond our platform with data from other platforms.
          This enables us to better understand the interests of our homepage visitors
          and to address them in a more targeted manner.
        </p>
        <br />
        <p dir="ltr">
          We respect that not every visitor of the platform wants this. Therefore, we
          only process your data in the course of advertising cookies if you consent
          to this (Art 6 para 1 lit a DSGVO). You can revoke this consent at any
          time, whereby the data processing carried out up to the time of revocation
          remains justified.
        </p>
        <br />
        <p dir="ltr">
          The following advertising cookies are currently used:
        </p>
        <br />
        <p dir="ltr">
          We currently do not use "advertising cookies".
        </p>
        <br />
        <ol start={2}>
          <li dir="ltr">
            <p dir="ltr">
              For what purposes do we process your data when you visit our
              platform?
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          We process your data on the basis of our legitimate interest (Art 6 para 1
          lit f DSGVO) in providing the platform as well as contractual and legal
          obligations (Art 6 para 1 lit b, c DSGVO).
        </p>
        <br />
        <p dir="ltr">
          If applicable, we process your data on the basis of your consent (Art 6
          para 1 lit a DSGVO).
        </p>
        <br />
        <ol start={3}>
          <li dir="ltr">
            <p dir="ltr">
              How long will your data be stored?
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          We will only store your data for as long as is necessary for the purposes
          of their collection. In this context, legal storage obligations must be
          taken into account (for example, for reasons of tax law, contracts and
          other documents from our contractual relationship, generally must be stored
          for a period of seven years (§ 132 BAO)). In justified individual cases,
          such as for the assertion and defence of legal claims, we may also store
          your data for up to 30 years after termination of the business
          relationship.
        </p>
        <br />
        <ol start={4}>
          <li dir="ltr">
            <p dir="ltr">
              Who may receive your data?
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          In the course of our business relationship, it may be necessary for us to
          pass on your data to the following recipients:
        </p>
        <br />
        <ul>
          <li dir="ltr">
            <p dir="ltr">
              Recipients: Auditors and tax advisors
            </p>
          </li>
          <ul>
            <li dir="ltr">
              <p dir="ltr">
                Purpose: Tax advice
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Legal basis: Contractual necessity
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Country: Austria
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Basis for transfer to third country: Within the EEA.
              </p>
            </li>
          </ul>
        </ul>
        <br />
        <ul>
          <li dir="ltr">
            <p dir="ltr">
              Recipients: Freelancer
            </p>
          </li>
          <ul>
            <li dir="ltr">
              <p dir="ltr">
                Purpose: Software programming
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Legal basis: Predominantly legitimate interests
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Country: Usually within the EU
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Basis for transfer to a third country: Within the EU
              </p>
            </li>
          </ul>
        </ul>
        <br />
        <ul>
          <li dir="ltr">
            <p dir="ltr">
              Recipients: Lawyers, courts, mediation, insurance company
            </p>
          </li>
          <ul>
            <li dir="ltr">
              <p dir="ltr">
                Purpose: Pursuit and defence of legal claims
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Legal basis: Predominantly legitimate interests
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Country: Austria
              </p>
            </li>
            <li dir="ltr">
              <p dir="ltr">
                Basis for transfer to a third country: Within the EEA
              </p>
            </li>
          </ul>
        </ul>
        <br />
        <ol start={5}>
          <li dir="ltr">
            <p dir="ltr">
              Collection of data from other sources (Art 14 DSGVO)
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          In the course of a business relationship or the initiation thereof, it is
          naturally necessary to conduct research on the business partner. This is
          only done to the extent necessary. In this context, data may be retrieved
          and processed from the following sources:
        </p>
        <br />
        <p dir="ltr">
          Our company does not obtain any data from third party sources.
        </p>
        <br />
        <ol start={6}>
          <li dir="ltr">
            <p dir="ltr">
              Does automated decision-making or profiling take place (Art 13 para
              2 lit f DSGVO)?
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          No automated decision-making or profiling takes place in our company.
        </p>
        <br />
        <ol start={7}>
          <li dir="ltr">
            <p dir="ltr">
              What rights do you have regarding data processing?
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          We would like to inform you that, provided the legal requirements are met,
          you have the right to :
        </p>
        <br />
        <ul>
          <li dir="ltr">
            <p dir="ltr">
              request information about which of your data is processed by us
              (see in detail Art 15 DSGVO).
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              request that inaccurate or incomplete data concerning you
              iscorrected or completed (see in detail Art 16 of the GDPR).
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              have your data deleted (see in detail Art 17 GDPR).
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              object to the processing of your data which is necessary to protect
              our legitimate interests or those of a third party (see in detail
              Art 21 of the GDPR). This applies in particular to the processing
              of your data for advertising purposes.
            </p>
          </li>
          <li dir="ltr">
            <p dir="ltr">
              receive the transfer of the data you have provided in a structured,
              common and machine-readable format.
            </p>
          </li>
        </ul>
        <br />
        <p dir="ltr">
          If we process your data on the basis of your consent, you have the right to
          revoke this consent at any time by email. This will not affect the
          lawfulness of the data processing carried out up to that point (Art 7 para
          3 DSGVO).
        </p>
        <br />
        <ol start={8}>
          <li dir="ltr">
            <p dir="ltr">
              What rights of appeal do you have?
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          If, contrary to expectations, there is a violation of your right to lawful
          processing of your data, please contact us by post or e-mail. We are
          committed to handle your requests promptly. However, you also have the
          right to lodge a complaint with the supervisory authority for data
          protection matters responsible for you.
        </p>
        <br />
        <p dir="ltr">
          The adress of the Austrian Data Protection Authority (Österreichische
          Datenschutzbehörde) is as follows:
        </p>
        <br />
        <p dir="ltr">
          Austrian Data Protection Authority
        </p>
        <p dir="ltr">
          Barichgasse 40-42,
        </p>
        <p dir="ltr">
          1030 Vienna
        </p>
        <br />
        <ol start={9}>
          <li dir="ltr">
            <p dir="ltr">
              How can you contact us?
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          If you have any further questions regarding the processing of your data,
          please do not hesitate to contact our data protection coordinator using the
          contact details below.
        </p>
        <br />
        <ol start={10}>
          <li dir="ltr">
            <p dir="ltr">
              Responsible party
            </p>
          </li>
        </ol>
        <br />
        <p dir="ltr">
          The responsible party in the sense of Art 4 Z 7 DSGVO is:
        </p>
        <br />
        <p dir="ltr">
          20Vision GmbH
        </p>
        <p dir="ltr">
          Office address: Anisgasse 30, 1220 Vienna (Austria)
        </p>
        <p dir="ltr">
          Email: business@20.vision
        </p>
        <br />
      </div>
      </div>
    )
}