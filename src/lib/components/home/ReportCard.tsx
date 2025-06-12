

export default function ReportCard({report} : {report:any}) {
  return (
    <div style={{border: "1px solid #eee", borderRadius: 12, marginBottom:8, padding: 16}}>
      <h3>{report.title}</h3>
      <p>{report.content}</p>
      {report.inInterestedReport && <span style={{color:"#2F6EEA"}}>☆즐겨찾기</span>}
    </div>
  )
}
