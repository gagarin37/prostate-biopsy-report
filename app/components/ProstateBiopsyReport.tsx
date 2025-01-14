import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";

const ProstateBiopsyReport = () => {
  const [cores, setCores] = useState([{
    id: 1,
    number: '',
    location: '',
    coreCount: '',
    totalLength: '',
    tumorLength: '',
    tumorPercentage: '',
    gleasonScore: '',
    whoGrade: '',
    type: 'azinär',
    diagnosis: {
      carcinoma: false,
      hgpin: false,
      asap: false,
      periprostaticTissue: false,
      noTissue: false
    },
    additionalFeatures: {
      pn1: false,
      idcP: false,
      epe: false
    }
  }]);

  const whoGradeMapping = {
    '3+3': 1,
    '3+4': 2,
    '4+3': 3,
    '4+4': 4,
    '4+5': 4,
    '5+4': 4,
    '5+5': 5
  };

  const addCore = () => {
    setCores([...cores, {
      id: cores.length + 1,
      number: '',
      location: '',
      coreCount: '',
      totalLength: '',
      tumorLength: '',
      tumorPercentage: '',
      gleasonScore: '',
      whoGrade: '',
      type: 'azinär',
      diagnosis: {
        carcinoma: false,
        hgpin: false,
        asap: false,
        periprostaticTissue: false,
        noTissue: false
      },
      additionalFeatures: {
        pn1: false,
        idcP: false,
        epe: false
      }
    }]);
  };

  const removeCore = (id) => {
    setCores(cores.filter(core => core.id !== id));
  };

  const updateCore = (id, field, value) => {
    setCores(cores.map(core => {
      if (core.id === id) {
        const updatedCore = { ...core, [field]: value };
        
        // Calculate tumor percentage if both lengths are present
        if (field === 'totalLength' || field === 'tumorLength') {
          if (updatedCore.totalLength && updatedCore.tumorLength) {
            const total = parseFloat(updatedCore.totalLength);
            const tumor = parseFloat(updatedCore.tumorLength);
            if (!isNaN(total) && !isNaN(tumor) && total > 0) {
              updatedCore.tumorPercentage = Math.round((tumor / total) * 100);
            }
          }
        }

        // Update WHO grade when Gleason score changes
        if (field === 'gleasonScore') {
          const scoreWithoutGrade = value.split('=')[0];
          updatedCore.whoGrade = whoGradeMapping[scoreWithoutGrade] || '';
        }

        return updatedCore;
      }
      return core;
    }));
  };

  const updateDiagnosis = (id, field) => {
    setCores(cores.map(core => {
      if (core.id === id) {
        if (field === 'carcinoma' && core.diagnosis[field]) {
          return {
            ...core,
            gleasonScore: '',
            whoGrade: '',
            diagnosis: {
              ...core.diagnosis,
              [field]: !core.diagnosis[field]
            }
          };
        }
        return {
          ...core,
          diagnosis: {
            ...core.diagnosis,
            [field]: !core.diagnosis[field]
          }
        };
      }
      return core;
    }));
  };

  const updateFeature = (id, field) => {
    setCores(cores.map(core => {
      if (core.id === id) {
        return {
          ...core,
          additionalFeatures: {
            ...core.additionalFeatures,
            [field]: !core.additionalFeatures[field]
          }
        };
      }
      return core;
    }));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Prostate Biopsy Report Generator</h1>

      <div className="space-y-4">
        {cores.map((core) => (
          <Card key={core.id} className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-24">
                      <label className="block text-sm font-medium mb-1">Nr.</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={core.number}
                        onChange={(e) => updateCore(core.id, 'number', e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-1">Lokalization</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={core.location}
                        onChange={(e) => updateCore(core.id, 'location', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-32">
                      <label className="block text-sm font-medium mb-1">Anzahl Stanzen</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={core.coreCount}
                        onChange={(e) => updateCore(core.id, 'coreCount', e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium mb-1">Gesamtlänge (mm)</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={core.totalLength}
                        onChange={(e) => updateCore(core.id, 'totalLength', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Diagnosis Checkboxes */}
                <div className="space-y-2">
                  <h3 className="font-medium">Diagnose</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Checkbox
                        checked={core.diagnosis.carcinoma}
                        onCheckedChange={() => updateDiagnosis(core.id, 'carcinoma')}
                        className="mr-2"
                      />
                      <span className="text-red-600 font-medium">Karzinom</span>
                    </label>
                    <label className="flex items-center">
                      <Checkbox
                        checked={core.diagnosis.hgpin}
                        onCheckedChange={() => updateDiagnosis(core.id, 'hgpin')}
                        className="mr-2"
                      />
                      HGPIN
                    </label>
                    <label className="flex items-center">
                      <Checkbox
                        checked={core.diagnosis.asap}
                        onCheckedChange={() => updateDiagnosis(core.id, 'asap')}
                        className="mr-2"
                      />
                      ASAP
                    </label>
                    <label className="flex items-center">
                      <Checkbox
                        checked={core.diagnosis.periprostaticTissue}
                        onCheckedChange={() => updateDiagnosis(core.id, 'periprostaticTissue')}
                        className="mr-2"
                      />
                      Periprostatisches Gewebe
                    </label>
                    <label className="flex items-center">
                      <Checkbox
                        checked={core.diagnosis.noTissue}
                        onCheckedChange={() => updateDiagnosis(core.id, 'noTissue')}
                        className="mr-2"
                      />
                      Kein Gewebe
                    </label>
                  </div>
                </div>
              </div>

              {/* Carcinoma Details */}
              {core.diagnosis.carcinoma && (
                <div className="border-t pt-4 space-y-4">
                  {/* Type Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Typ</label>
                    <select
                      className="w-full p-2 border rounded"
                      value={core.type}
                      onChange={(e) => updateCore(core.id, 'type', e.target.value)}
                    >
                      <option value="azinär">azinär</option>
                      <option value="duktal">duktal</option>
                      <option value="azinär / duktal">azinär / duktal</option>
                    </select>
                  </div>

                  {/* Tumor Length and Percentage */}
                  <div className="flex gap-4">
                    <div className="w-32">
                      <label className="block text-sm font-medium mb-1">Tumorlänge (mm)</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={core.tumorLength}
                        onChange={(e) => updateCore(core.id, 'tumorLength', e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <label className="block text-sm font-medium mb-1">Tumor %</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded bg-gray-50"
                        value={core.tumorPercentage}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* Gleason Score */}
                  <div>
                    <h3 className="font-medium mb-2">Gleason Score</h3>
                    <div className="flex flex-wrap gap-2">
                      {['3+3=6', '3+4=7a', '4+3=7b', '4+4=8', '4+5=9', '5+4=9', '5+5=10'].map((score) => (
                        <button
                          key={score}
                          className={`px-4 py-2 rounded border ${
                            core.gleasonScore === score.split('=')[0]
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => updateCore(core.id, 'gleasonScore', score.split('=')[0])}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* WHO Grade */}
                  {core.whoGrade && (
                    <div>
                      <label className="block text-sm font-medium mb-1">WHO Grade Group</label>
                      <div className="px-4 py-2 bg-gray-50 rounded border">
                        {core.whoGrade}
                      </div>
                    </div>
                  )}

                  {/* Additional Features */}
                  <div>
                    <h3 className="font-medium mb-2">Additional Features</h3>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <Checkbox
                          checked={core.additionalFeatures.pn1}
                          onCheckedChange={() => updateFeature(core.id, 'pn1')}
                          className="mr-2"
                        />
                        Pn1
                      </label>
                      <label className="flex items-center">
                        <Checkbox
                          checked={core.additionalFeatures.idcP}
                          onCheckedChange={() => updateFeature(core.id, 'idcP')}
                          className="mr-2"
                        />
                        IDC-P
                      </label>
                      <label className="flex items-center">
                        <Checkbox
                          checked={core.additionalFeatures.epe}
                          onCheckedChange={() => updateFeature(core.id, 'epe')}
                          className="mr-2"
                        />
                        EPE
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cores.length > 1 && (
              <button
                className="mt-4 p-2 text-red-600 hover:text-red-800"
                onClick={() => removeCore(core.id)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </Card>
        ))}
      </div>

      <button
        className="mt-4 p-4 bg-yellow-400 rounded-full hover:bg-yellow-500 transition-colors"
        onClick={addCore}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ProstateBiopsyReport;
