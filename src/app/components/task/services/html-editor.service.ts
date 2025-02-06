import { Injectable } from '@angular/core';

import { guid } from '@firestitch/common';
import { ChecklistPlugin, FsHtmlEditorConfig, MentionPlugin } from '@firestitch/html-editor';

import { TaskAccountData, TaskData } from '../../../data';


@Injectable()
export class HtmlEditorService {

  public getImageUploadConfig(taskId, taskData: TaskData) {
    return {
      quality: 0.8,
      width: 1200,
      height: 1200,
      upload: (file) => {
        return taskData.postImage(taskId, file);
      },
    };
  }

  public getAccountMentionPlugin(taskAccountData: TaskAccountData): MentionPlugin {
    return new MentionPlugin({
      trigger: '@',
      name: 'accountMention',
      menuItemTemplate: (account) => {
        const text = `<img src="${account.avatar.tiny}"> ${account.name}`;
        const attributes = {
          class: 'mention-account-menu-item',
        };

        return this.createElement(attributes, text);
      },
      selectedTemplate: (account) => {
        const text = `@${account.name}`;
        const attributes = {
          'data-mention': 'account',
          'data-account-id': account.id,
          'data-ref': guid('xxxxxxxx'),
        };

        return this.createElement(attributes, text);
      },
      fetch: (keyword) => {
        return taskAccountData
          .gets({
            keyword,
            avatars: true,
          });
      },
    });
  }

  public getCommentConfig(
    config: FsHtmlEditorConfig, 
    taskId: number,
    taskAccountData: TaskAccountData,
    taskData: TaskData,
  ): FsHtmlEditorConfig {
    config = config || {};

    return {
      ...config,
      image: this
        .getImageUploadConfig(taskId, taskData),
      plugins: [
        ...(config.plugins || []),
        this.getAccountMentionPlugin(taskAccountData),
        new ChecklistPlugin(),
      ],
    };
  }

  public getDescriptionConfig(
    config: FsHtmlEditorConfig, 
    taskId: number, 
    taskData: TaskData,
  ): FsHtmlEditorConfig {
    config = config || {};

    return {
      ...config,
      image: this
        .getImageUploadConfig(taskId, taskData),
      plugins: [
        ...(config.plugins || []),
        new ChecklistPlugin(),
      ],
    };
  }

  public createElement(attributes, text): string {
    const el = document.createElement('span');
    Object.keys(attributes)
      .forEach((name) => {
        el.setAttribute(name, attributes[name]);
      });

    el.innerHTML = text;
    const containerEl = document.createElement('div');
    containerEl.append(el);

    return containerEl.innerHTML;
  }

}
