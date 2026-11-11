import React, { useState, useEffect } from 'react';
import { Report } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { supabaseApi } from '../../lib/supabase';
import { ShieldAlert, CheckCircle2, Trash2, AlertTriangle, RefreshCw, XCircle, FileText } from 'lucide-react';

export const ModerationQueue: React.FC = () => {
  const { isModerator, user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [actioningId, setActioningId] = useState<string | null>(null);
  const [auditNotes, setAuditNotes] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchReports = async () => {
    if (!isModerator) return;
    setIsLoading(true);
    try {
      const data = await supabaseApi.getModerationReports();
      setReports(data);
    } catch (err: any) {
      console.error('Failed fetching reports', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [isModerator]);

  if (!isModerator) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl text-stone-900">Restricted Staff Queue</h2>
        <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
          Access to this area requires verified moderator permissions backed by Row Level Security in Supabase. Your current pseudonymous account is not authorized.
        </p>
      </div>
    );
  }

  const handleDecision = async (
    report: Report,
    decision: 'dismissed' | 'removed' | 'warning'
  ) => {
    if (!user) return;
    setActioningId(report.id);
    setStatusMessage(null);

    try {
      const note = auditNotes[report.id] || '';
      await supabaseApi.submitModerationDecision({
        reportId: report.id,
        experienceId: report.experience_id,
        moderatorUserId: user.id,
        decision,
        notes: note,
      });

      setStatusMessage(
        decision === 'removed'
          ? 'Violating experience successfully purged from public discovery.'
          : 'Report dismissed. Experience remains published.'
      );

      // Remove from list
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch (err: any) {
      alert(err.message || 'Moderation decision failed.');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE7E0] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono tracking-widest uppercase text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-700" />
            <span>STAFF OVERSIGHT SANCTUARY</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-sanctuary-900 font-normal">
            Moderation Queue
          </h1>
          <p className="text-xs text-stone-600 max-w-xl">
            Review reported reflections. Remove content violating community tenets while preserving user confidentiality.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 rounded-full bg-white border border-stone-200 text-xs font-mono text-stone-700">
            Pending Reports: {reports.length}
          </span>
          <button
            onClick={fetchReports}
            disabled={isLoading}
            className="p-1.5 rounded-full hover:bg-white text-stone-500 hover:text-stone-900"
            title="Refresh queue"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center justify-between border border-emerald-200 animate-in fade-in">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-900 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-6">
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-stone-200 h-44" />
            ))}
          </div>
        )}

        {!isLoading && reports.length === 0 && (
          <div className="bg-white rounded-3xl p-12 border border-[#E7E4DC] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-stone-900">Queue is Clear</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              No outstanding community reports require moderation at this moment. The sanctuary is calm.
            </p>
          </div>
        )}

        {!isLoading &&
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-subtle space-y-5"
            >
              {/* Report Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-stone-500">Report #{report.id.substring(0, 8)}</span>
                  <span>•</span>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-medium text-[11px]">
                    Reason: {report.reason}
                  </span>
                </div>
                <div className="text-stone-400">
                  {new Date(report.created_at).toLocaleString()}
                </div>
              </div>

              {/* Reported Content Preview */}
              <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-3">
                <div className="text-[11px] font-mono uppercase text-stone-500 tracking-wider flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Reported Content Preview</span>
                </div>

                {report.experience?.title && (
                  <h4 className="font-serif text-lg text-stone-900">
                    {report.experience.title}
                  </h4>
                )}

                {report.experience?.text_content && (
                  <p className="font-serif text-stone-700 text-xs sm:text-sm leading-relaxed whitespace-pre-line italic">
                    "{report.experience.text_content}"
                  </p>
                )}

                {report.experience?.image && (
                  <div className="rounded-xl overflow-hidden max-w-sm border border-stone-200">
                    <img
                      src={report.experience.image.image_url}
                      alt="Reported content"
                      className="w-full h-44 object-cover"
                    />
                  </div>
                )}

                {report.details && (
                  <div className="pt-2 text-[11px] text-stone-600 border-t border-stone-200">
                    <span className="font-semibold text-stone-800">Reporter's context:</span> {report.details}
                  </div>
                )}
              </div>

              {/* Moderator Decision & Notes */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-stone-700">
                    Audit Notes (recorded in moderation log)
                  </label>
                  <input
                    type="text"
                    value={auditNotes[report.id] || ''}
                    onChange={(e) =>
                      setAuditNotes({ ...auditNotes, [report.id]: e.target.value })
                    }
                    placeholder="Provide justification for moderation decision..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900 font-sans"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleDecision(report, 'dismissed')}
                    disabled={actioningId === report.id}
                    className="px-4 py-2 rounded-full border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 font-medium transition-colors"
                  >
                    Dismiss Report
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDecision(report, 'removed')}
                    disabled={actioningId === report.id}
                    className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-medium shadow-sm transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Violating Experience</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

    </div>
  );
};

