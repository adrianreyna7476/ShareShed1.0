const toolService = require('./toolService');

class DamageReport {
  constructor(id, loanId, toolId, memberId, description) {
    this.id = id;
    this.loanId = loanId;
    this.toolId = toolId;
    this.memberId = memberId;
    this.description = description;
    this.reportedDate = new Date();
    this.status = 'open';
    this.resolvedDate = null;
  }

  isOpen() {
    return this.status === 'open';
  }
}

const reports = [];
let nextId = 1;

function createReport(loan, description) {
  if (!description || !description.trim()) {
    throw new Error('Please describe the damage.');
  }
  const report = new DamageReport(nextId++, loan.id, loan.toolId, loan.memberId, description.trim());
  reports.push(report);
  return report;
}

function getAllReports() {
  return reports;
}

function getOpenReports() {
  return reports.filter(r => r.isOpen());
}

function resolveReport(reportId, decision) {
  const report = reports.find(r => r.id === reportId);
  if (!report) {
    throw new Error('Damage report not found.');
  }
  if (!report.isOpen()) {
    throw new Error('This report has already been resolved.');
  }
  if (decision !== 'confirm' && decision !== 'deny') {
    throw new Error('Choose confirm or deny.');
  }

  const tool = toolService.getToolById(report.toolId);
  report.status = decision === 'confirm' ? 'confirmed' : 'denied';
  report.resolvedDate = new Date();

  if (tool) {
    if (decision === 'confirm') {
      tool.condition = 'Repaired';
    }
    tool.setStatus('available');
  }

  return report;
}

module.exports = { DamageReport, createReport, getAllReports, getOpenReports, resolveReport };
