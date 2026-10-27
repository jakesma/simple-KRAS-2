import { useState } from 'react';
import { ArrowLeft, ClipboardCheck, Printer, Save } from 'lucide-react';
import { RiskAssessment } from '../types';

interface TbmMeetingFormProps {
  assessment: RiskAssessment;
  onBack: () => void;
}

interface TbmMeetingRecord {
  id: string;
  assessmentId: string;
  date: string;
  attendees: string;
  notes: string;
  selectedHazardIds: string[];
  savedAt: string;
}

const getToday = () => new Date().toISOString().slice(0, 10);

export default function TbmMeetingForm({ assessment, onBack }: TbmMeetingFormProps) {
  const hazards = assessment.processes.flatMap((process) =>
    process.hazards.map((hazard) => ({ ...hazard, processName: process.processName }))
  );
  const defaultHazardIds = hazards.filter((hazard) => hazard.riskScore >= 9).map((hazard) => hazard.id);
  const [date, setDate] = useState(getToday());
  const [attendeeNames, setAttendeeNames] = useState<string[]>(Array(30).fill(''));
  const [attendeeRoles, setAttendeeRoles] = useState<string[]>(Array(30).fill(''));
  const [attendeeSignatures, setAttendeeSignatures] = useState<string[]>(Array(30).fill(''));
  const [notes, setNotes] = useState('작업 전 보호구 상태, 작업구역 정리정돈 및 안전장치 이상 유무를 확인한다.');
  const [selectedHazardIds, setSelectedHazardIds] = useState(defaultHazardIds);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const toggleHazard = (hazardId: string) => {
    setSelectedHazardIds((current) =>
      current.includes(hazardId) ? current.filter((id) => id !== hazardId) : [...current, hazardId]
    );
  };

  const saveMeeting = () => {
    const record: TbmMeetingRecord = {
      id: `tbm_${Date.now()}`,
      assessmentId: assessment.id,
      date,
      attendees: attendeeNames.filter(Boolean).join(', '),
      notes,
      selectedHazardIds,
      savedAt: new Date().toISOString()
    };

    try {
      const savedRecords = JSON.parse(localStorage.getItem('kras_construction_tbm_meetings') || '[]') as TbmMeetingRecord[];
      const remainingRecords = savedRecords.filter(
        (savedRecord) => !(savedRecord.assessmentId === assessment.id && savedRecord.date === date)
      );
      localStorage.setItem('kras_construction_tbm_meetings', JSON.stringify([record, ...remainingRecords]));
      setSavedAt(new Date().toLocaleTimeString());
    } catch {
      localStorage.setItem('kras_construction_tbm_meetings', JSON.stringify([record]));
      setSavedAt(new Date().toLocaleTimeString());
    }
  };

  const selectedHazards = hazards.filter((hazard) => selectedHazardIds.includes(hazard.id));
  const updateAttendeeField = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6 print:bg-white print:p-0" id="tbm-meeting-form">
      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950"
            id="tbm-back-btn"
          >
            <ArrowLeft size={18} /> 위험성평가 문서로 돌아가기
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={saveMeeting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
              id="tbm-save-btn"
            >
              <Save size={14} /> TBM 저장
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
              id="tbm-print-btn"
            >
              <Printer size={14} /> 인쇄 및 PDF 저장
            </button>
          </div>
        </div>

        <section className="bg-white p-5 shadow-sm sm:p-8 print:shadow-none" aria-label="일일 TBM 회의록">
          <div className="mb-6 flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <div className="mb-1 flex items-center gap-2 text-emerald-700">
                <ClipboardCheck size={20} />
                <span className="text-xs font-bold">DAILY TOOLBOX MEETING</span>
              </div>
              <h1 className="text-2xl font-black text-slate-950">일일 TBM 회의록</h1>
              <p className="mt-1 text-sm text-slate-500">{assessment.title}의 위험성평가 내용을 바탕으로 생성되었습니다.</p>
            </div>
            <span className="rounded border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600">TBM-01</span>
          </div>

          <div className="grid gap-4 border-b border-slate-300 pb-5 sm:grid-cols-2">
            <label className="text-xs font-bold text-slate-600">
              회의 일자
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="mt-1.5 w-full border border-slate-300 px-3 py-2 text-sm font-medium text-slate-900"
                id="tbm-date-input"
              />
            </label>
            <label className="text-xs font-bold text-slate-600">
              현장명
              <input
                value={assessment.companyProfile.companyName}
                readOnly
                placeholder="현장명을 입력하세요"
                className="mt-1.5 w-full border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900"
              />
            </label>
          </div>

          <div className="mt-6">
            <h2 className="border-l-4 border-emerald-600 pl-2 text-sm font-black text-slate-900">오늘의 안전 작업 사항</h2>
            <p className="mt-1 text-xs text-slate-500">위험성평가에서 오늘 작업에 해당하는 항목을 선택해 교육 내용으로 사용합니다.</p>
            <div className="mt-3 overflow-x-auto border border-slate-300">
              <table className="w-full min-w-[700px] text-left text-xs">
                <thead className="bg-slate-100 text-slate-700">
                  <tr>
                    <th className="w-12 border-b border-slate-300 p-3 text-center">선택</th>
                    <th className="border-b border-slate-300 p-3">공정</th>
                    <th className="border-b border-slate-300 p-3">유해위험요인</th>
                    <th className="border-b border-slate-300 p-3">오늘의 안전조치</th>
                  </tr>
                </thead>
                <tbody>
                  {hazards.map((hazard) => (
                    <tr key={hazard.id} className="border-b border-slate-200 last:border-0">
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedHazardIds.includes(hazard.id)}
                          onChange={() => toggleHazard(hazard.id)}
                          aria-label={`${hazard.processName} 위험요인 선택`}
                        />
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{hazard.processName}</td>
                      <td className="p-3 text-slate-700">{hazard.hazardSituation || hazard.accidentType}</td>
                      <td className="p-3 text-slate-700">{hazard.reductionMeasures || hazard.currentSafetyMeasures || '-'}</td>
                    </tr>
                  ))}
                  {hazards.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500">등록된 위험요인이 없습니다. 위험성평가를 먼저 작성해 주세요.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <label className="mt-6 block text-xs font-bold text-slate-600">
            추가 전달사항 및 작업 전 점검 내용
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={4}
              className="mt-1.5 w-full border border-slate-300 p-3 text-sm text-slate-900"
              id="tbm-notes-input"
            />
          </label>

          <div className="mt-6 grid gap-4 border-t border-slate-300 pt-5 text-xs text-slate-600 sm:grid-cols-3">
            <div><span className="font-bold text-slate-900">관리감독자:</span> {assessment.companyProfile.siteManager || '________________'}</div>
            <div><span className="font-bold text-slate-900">참석 인원:</span> {attendeeNames.filter((name) => name.trim()).length}명</div>
            <div><span className="font-bold text-slate-900">교육 항목:</span> {selectedHazards.length}건</div>
          </div>

          <div className="mt-6 break-inside-avoid border-t-2 border-slate-900 pt-4" id="tbm-attendee-section">
            <h2 className="mb-3 text-sm font-black text-slate-900">참석자 확인 및 서명부</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 print:grid-cols-2" id="tbm-attendee-tables">
              {[0, 15].map((startIndex) => (
                <table key={startIndex} className="w-full table-fixed border-collapse border border-slate-900 text-[10px] text-center">
                  <thead>
                    <tr className="bg-slate-100 font-bold text-slate-800">
                      <th className="w-10 border-r border-slate-900 p-1.5">NO</th>
                      <th className="w-[34%] border-r border-slate-900 p-1.5">이름</th>
                      <th className="w-[26%] border-r border-slate-900 p-1.5">직책</th>
                      <th className="p-1.5">서명</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 15 }, (_, rowIndex) => {
                      const attendeeIndex = startIndex + rowIndex;
                      return (
                        <tr key={attendeeIndex} className="h-8 border-t border-slate-900">
                          <td className="border-r border-slate-900 font-mono">{attendeeIndex + 1}</td>
                          <td className="border-r border-slate-900 p-0">
                            <input
                              value={attendeeNames[attendeeIndex]}
                              onChange={(event) => updateAttendeeField(setAttendeeNames, attendeeIndex, event.target.value)}
                              aria-label={`${attendeeIndex + 1}번 참석자 이름`}
                              className="h-8 w-full border-0 bg-transparent px-1.5 text-center text-[10px] outline-none"
                            />
                          </td>
                          <td className="border-r border-slate-900 p-0">
                            <input
                              value={attendeeRoles[attendeeIndex]}
                              onChange={(event) => updateAttendeeField(setAttendeeRoles, attendeeIndex, event.target.value)}
                              aria-label={`${attendeeIndex + 1}번 참석자 직책`}
                              className="h-8 w-full border-0 bg-transparent px-1.5 text-center text-[10px] outline-none"
                            />
                          </td>
                          <td className="p-0">
                            <input
                              value={attendeeSignatures[attendeeIndex]}
                              onChange={(event) => updateAttendeeField(setAttendeeSignatures, attendeeIndex, event.target.value)}
                              aria-label={`${attendeeIndex + 1}번 참석자 서명`}
                              className="h-8 w-full border-0 bg-transparent px-1.5 text-center text-[10px] outline-none"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ))}
            </div>
          </div>

          {savedAt && <p className="mt-4 text-right text-xs font-semibold text-emerald-700" id="tbm-saved-notice">저장됨 {savedAt}</p>}
        </section>
      </div>
    </div>
  );
}
