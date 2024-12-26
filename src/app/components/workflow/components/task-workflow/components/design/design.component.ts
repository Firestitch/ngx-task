import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

import {
  ConnectionAdded,
  DiagramConfig,
  DiagramConnection,
  EndpointShape,
  FsDiagramDirective,
  FsDiagramModule,
  FsDiagramObjectDirective,
} from '@firestitch/diagram';
import { FsLabelModule } from '@firestitch/label';
import { FsPrompt } from '@firestitch/prompt';
import { FsZoomPanComponent, FsZoomPanModule } from '@firestitch/zoom-pan';

import { forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';


import { TaskStatusData, TaskWorkflowData } from '../../../../../../data';
import { TaskStatusChipComponent } from '../../../../../task-status';

import { ObjectValuesPipe } from './pipes/object-values.pipe';


@Component({
  selector: 'app-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,

    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    
    FsZoomPanModule,
    FsLabelModule,
    FsDiagramModule,

    TaskStatusChipComponent,
    ObjectValuesPipe,
  ],
  providers: [
    TaskWorkflowData,
    TaskStatusData,
  ],
})
export class DesignComponent implements OnInit, OnDestroy {

  @Input() public taskWorkflow;

  @ViewChild(FsZoomPanComponent, { static: true })
  public zoomPan: FsZoomPanComponent;

  @ViewChild(FsDiagramDirective)
  public diagram: FsDiagramDirective;
  
  public taskStatuses = {};
  public workflowSteps = {};
  public config: DiagramConfig = {
    paintStyle: {
      stroke: '#0061AF',
    },
  };

  private _destroy$ = new Subject<void>();
  private _taskWorkflowData = inject(TaskWorkflowData);
  private _cdRef = inject(ChangeDetectorRef);
  private _taskStatusData = inject(TaskStatusData);
  private _prompt = inject(FsPrompt);

  public ngOnInit(): void {
    this._loadData();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public zoomIn(): void {
    this.zoomPan.zoomIn();
  }

  public zoomOut(): void {
    this.zoomPan.zoomOut();
  }

  public reset(): void {
    this.zoomPan.reset();
  }

  public workflowTaskStatusClick(event: MatCheckboxChange, taskStatus): void {
    if (event.checked) {
      this._addWorkflowStepStatus(taskStatus);
    } else {
      this._removeWorkflowStepStatus(taskStatus);
    }
  }

  public objectsAdded(diagramObjectDirectives: FsDiagramObjectDirective[]): void {
    diagramObjectDirectives.forEach((diagramObjectDirective) => {
      diagramObjectDirective.data.sourceTaskWorkflowPaths
        .forEach((sourceTaskWorkflowPath) => {
          const sourceWorkflowStep = Object.values(this.workflowSteps)
            .find((workflowStep: any) => workflowStep.id === sourceTaskWorkflowPath.sourceTaskWorkflowStepId);

          const targetWorkflowStep = Object.values(this.workflowSteps)
            .find((workflowStep: any) => workflowStep.id === sourceTaskWorkflowPath.targetTaskWorkflowStepId);
        
          if (sourceWorkflowStep && targetWorkflowStep) {
            const diagramConnection = this.diagram.connect(
              sourceWorkflowStep, 
              targetWorkflowStep, 
            );

            this.updateConnection(diagramConnection);
          }
        });
    });
  }

  public updateConnection(diagramConnection: DiagramConnection): void {
    diagramConnection.setTargetEndpoint({
      shape: EndpointShape.Arrow,
    });

    diagramConnection
      .setClick(() => {
        this._prompt.confirm({
          title: 'Delete Connection',
          template: 'Are you sure you want to delete this connection?',
        })
          .pipe(
            switchMap(() =>   {
              const taskWorkflowPath = {
                targetTaskWorkflowStepId: diagramConnection.target.data.id,
                sourceTaskWorkflowStepId: diagramConnection.source.data.id,
              };

              return  this._taskWorkflowData
                .deleteWorkflowPath(this.taskWorkflow.id, taskWorkflowPath);
            }),
          )
          .subscribe(() => {
            diagramConnection.disconnect();
          });
      });
  }

  public connectionAdded(connectionAdded: ConnectionAdded): void {
    const taskWorkflowPath = {
      id: null,
      targetTaskWorkflowStepId: connectionAdded.target.data.id,
      sourceTaskWorkflowStepId: connectionAdded.source.data.id,
    };

    this._taskWorkflowData
      .postWorkflowPath(this.taskWorkflow.id, taskWorkflowPath)
      .subscribe();

    this.updateConnection(connectionAdded.connection);
  }

  public workflowStepDragStop(event: any, taskStatusId: number): void {
    const workflowStep = {
      x1: event.x1,
      y1: event.y1,
      taskStatusId: taskStatusId,
    };

    this._taskWorkflowData
      .putWorkflowStep(this.taskWorkflow.id, workflowStep)
      .subscribe();
  }

  private _loadData(): void {
    forkJoin({
      taskStatuses: this._taskStatusData.gets(),
      workflowSteps: this._taskWorkflowData.getWorkflowSteps(this.taskWorkflow.id, {
        sourceTaskWorkflowPaths: true,
      }),
    })
      .pipe(
        tap(({ taskStatuses, workflowSteps }) => {
          this.taskStatuses = taskStatuses
            .reduce((accum, taskStatus) => {
              return {
                ...accum,
                [taskStatus.id]: taskStatus,
              };
            }, {});
  
          this.workflowSteps = workflowSteps
            .reduce((accum, workflowStep) => {
              return {
                ...accum,
                [workflowStep.taskStatusId]: workflowStep,
              };
            }, {});
  
          this._cdRef.markForCheck();
        }),
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  private _saveWorkflowStep(workflowStep): void {
    this._taskWorkflowData
      .putWorkflowStep(this.taskWorkflow.id, workflowStep)
      .subscribe((data) => {
        this.workflowSteps = {
          ...this.workflowSteps,
          [workflowStep.taskStatusId]: data,
        };
        this._cdRef.markForCheck();
      });
  }

  private _removeWorkflowStepStatus(taskStatus): void {
    this._taskWorkflowData
      .deleteWorkflowStep(this.taskWorkflow.id, this.workflowSteps[taskStatus.id])
      .subscribe(() => {
        this.workflowSteps = Object.values(this.workflowSteps)
          .filter((item: any) => taskStatus.id !== item.taskStatusId)
          .reduce((accum: any, item: any) => {
            return {
              ...accum,
              [item.taskStatusId]: item,
            };
          }, {});
        this._cdRef.markForCheck();
      });
  }

  private _addWorkflowStepStatus(taskStatus): void {
    const workflowStep = {
      x1: 100,
      y1: 100,
      taskStatusId: taskStatus.id,
    };

    this._saveWorkflowStep(workflowStep);
  }
  
  //   this._workflowData.postSteps(this.workflow.id, workflowStep)
  //     .pipe(
  //       takeUntil(this._destroy$),
  //     )
  //     .subscribe((response) => {
  //       response.status = status;
  //       response.workflowTask = workflowTask;
  //       response.workflowPaths = [];
  //       this._workflowSteps.set(response.id, response);

  //       this._cdRef.markForCheck();
  //     });
  // }

  // private _getConnectionConfig(workflowPath: WorkflowPath): ConnectionConfig {
  //   workflowPath.workflowActions = workflowPath.workflowActions || [];
  //   const actionsCount = workflowPath.workflowActions.length;

  //   const actionsLabel = actionsCount
  //     ? `${actionsCount} ${actionsCount === 1 ? 'Action' : 'Actions'}`
  //     : '';

  //   const name = workflowPath.name ? `${workflowPath.name  }\n` : '';
  //   const tooltip = this._formTooltip(workflowPath);

  //   const config: ConnectionConfig = {
  //     label: {
  //       content: `${name || 'Untitled'} <div class="actions-label">${actionsLabel}</div>`,
  //       click: () => {
  //         this.openWorkflowPathDialog(workflowPath);
  //       },
  //     },
  //     click: () => {
  //       this.openWorkflowPathDialog(workflowPath);
  //     },
  //     data: { object: workflowPath },
  //   };

  //   if (tooltip) {
  //     config.tooltip = {
  //       content: tooltip,
  //     };
  //   }

  //   return config;
  // }

  // private _processWorkflowPath(
  //   action: 'close' | 'save' | 'delete' | 'cancel',
  //   workflowPath: WorkflowPath,
  //   uniqConnectionId: string = null): void {

  //   const targetWorkflowStep = this._workflowSteps.get(workflowPath.targetWorkflowStepId);
  //   const sourceWorkflowStep = this._workflowSteps.get(workflowPath.sourceWorkflowStepId);

  //   if (sourceWorkflowStep && targetWorkflowStep) {
  //     let connection = null;

  //     connection = action === 'cancel' ? this.diagram.getConnections().find((item) => item.connection.id === uniqConnectionId) : this.diagram.getConnections(sourceWorkflowStep, targetWorkflowStep, uniqConnectionId)[0];

  //     if (connection) {
  //       switch (action) {
  //         case 'delete': {
  //           connection.disconnect();
  //           sourceWorkflowStep.workflowPaths = remove(sourceWorkflowStep.workflowPaths, (item: WorkflowPath) => {
  //             return item.id === workflowPath.id;
  //           });
  //         } break;
  //         case 'save':
  //         case 'close': {
  //           connection.config = this._getConnectionConfig(workflowPath);
  //           connection.render();
  //           break;
  //         }
  //         case 'cancel': {
  //           connection.disconnect();
  //           break;
  //         }
  //       }
  //     }
  //   }
  // }

}
