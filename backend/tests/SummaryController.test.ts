import { Request, Response } from 'express';
import SummaryController from '../controllers/SummaryController';
import TranscribeService  from '../services/TranscribeService';
import SummaryService from '../services/SummaryService';

describe('SummaryController', () => {
    let summaryController: SummaryController;
    let mockTranscribeService: Partial<TranscribeService>;
    let mockSummaryService: Partial<SummaryService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockTranscribeService = {
            transcribeAudio: jest.fn(),
            cleanUp: jest.fn(),
        };

        mockSummaryService = {
            findAllSummaries: jest.fn(),
            findSummaryById: jest.fn(),
            getSummaryFromModel: jest.fn(),
            addSummarytoDB: jest.fn(),
            deleteSummary: jest.fn(),
        };

        summaryController = new SummaryController(mockTranscribeService as TranscribeService, mockSummaryService as SummaryService);
        mockRequest = {};
        mockResponse = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };
    });

    test('getUserSummaries should return user summaries', async () => {
        mockRequest = { user: { id: '123' } }; // Changed to use 'user' property
        (mockSummaryService.findAllSummaries as jest.Mock).mockResolvedValue([{ id: '1', summary: 'Test summary' }]);

        await summaryController.getUserSummaries(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.json).toHaveBeenCalledWith([{ id: '1', summary: 'Test summary' }]);
    });

    test('getSummaryById should return summary by ID', async () => {
        mockRequest.body = { userId: '1' };
        (mockSummaryService.findSummaryById as jest.Mock).mockResolvedValue({ id: '1', summary: 'Test summary' });

        await summaryController.getSummaryById(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.json).toHaveBeenCalledWith({ id: '1', summary: 'Test summary' });
    });

    test('transcribeAudio should return transcription summary', async () => {
        mockRequest.file = { // Mocking the File object with required properties
            fieldname: 'file',
            originalname: 'audio.mp3',
            encoding: '7bit',
            mimetype: 'audio/mpeg',
            buffer: Buffer.from(''),
            size: 0,
            stream: new (require('stream').Readable)(), // Changed to an empty Readable stream
            destination: '', // Add missing property
            filename: 'audio.mp3', // Add missing property
            path: '/path/to/audio.mp3' // Add missing property
        };
        (mockTranscribeService.transcribeAudio as jest.Mock).mockResolvedValue('Transcribed text');
        (mockSummaryService.getSummaryFromModel as jest.Mock).mockResolvedValue('Summary from model');

        await summaryController.transcribeAudio(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.json).toHaveBeenCalledWith({ summary: 'Summary from model' });
    });

    test('addToSummary should add summary to database', async () => {
        mockRequest.body = { userId: '123', summaryHead: 'Head', summaryBody: 'Body' };
        (mockSummaryService.addSummarytoDB as jest.Mock).mockResolvedValue(undefined);

        await summaryController.addToSummary(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Summary added successfully!' });
    });

    test('deleteFromSummary should delete summary', async () => {
        mockRequest.body = { summaryId: '1' };
        (mockSummaryService.deleteSummary as jest.Mock).mockResolvedValue(undefined);

        await summaryController.deleteFromSummary(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith("Deleted Summary! ");
    });
});